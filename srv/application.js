import express from 'express'
import passport from 'passport'
import {JWTStrategy} from '@sap/xssec'
import {getServices, loadEnv} from '@sap/xsenv'
import hanaClient from './lib/util/hana-client.js'
import Database from './lib/database/db-service.js'
import router from './lib/router/router.js'
import Storage from './lib/database/storage.js'
import AppController from './lib/app-controller.js'
import EventEmitter from 'events'
import MessagingService from './lib/messaging/messaging-service.js'

export default async (log) => {
    const app = express()
    app.use(express.static('public'))
    loadEnv()
    const xsuaa = getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa;
    const aem = {credentials : getServices({ ['user-provided']: { name: 'aem-ups'}})['user-provided']}
    const hana = getServices({ hana: { label: 'hana' }}).hana

    log.info(aem)

    log.info("Connected to Hana: ", hana)

    const dbClient = new Database(hanaClient, hana)
    await dbClient.connect()

    let connectionString = MessagingService.connectionString(aem.credentials?.username, 
        aem.credentials?.password, aem.credentials?.port, aem.credentials?.url)
    // Messaging service activation
    const appController = new AppController(new EventEmitter, connectionString, 
        aem.credentials?.username, aem.credentials?.password, 
        aem.credentials?.management, Storage, dbClient, log)
    await appController.start()

    app.get('/health', (_ , res) => {
        res
          .status(200)
          .type('text/plain')
          .send('OK')
      })

    app.use(hanaClient.middleware(hana))


    app.use('/api/v1', router("storage", log))

    passport.use(new JWTStrategy(xsuaa))
    app.use(log.logNetwork)
    app.use(passport.initialize())
    app.use(passport.authenticate('JWT', {session: false}))





    app.use(({stack, message, code = 500}, req, res, next) => {
        const {logger = log} = req
        logger.error(stack)
        res
          .status(code)
          .set('Content-Type', 'text/plain')
          .send(message)
    })

    // Listen for interruption signals (e.g. Ctrl-C) and close the connection gracefully
    process.on("SIGINT", async () => {
        console.log("Closing connection...");
        await appController.stop();
        await dbClient.disconnect();
        process.exit();
    });

    return app
}