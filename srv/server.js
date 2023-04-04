import application from './application.js'
import log from 'cf-nodejs-logging-support'

const {PORT = 4004, LOGGING_LEVEL: loggingLevel = 'debug'} = process.env
log.setLoggingLevel(loggingLevel)
const app = await application(log)

app.listen(PORT, ()=> log.info(`Server is listening on Port: ${PORT}`))
    .on('error', ({message})=> log.error('Error starting server', message))

