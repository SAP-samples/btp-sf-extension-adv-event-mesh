import { v4 } from "uuid";
import MessagingService from "./messaging/messaging-service.js"; 
import config from "../config.js";
export default class AppController {
  constructor(handlers, url, username, password, management, storage, db, logger) {
    this.queue = config.queueName || 'express-app-consumer'
    this.messaging = new MessagingService(url, username, password, this.queue, management);
    this.handlers = handlers;
    this.topics = config.topics;

    if(!Array.isArray(config.topics) || (Array.isArray(config.topics) &&  config.topics.length === 0)){
      throw new Error("No topics found to subscribe")
    }

    for (const topic of this.topics) {

      this.handlers.on(topic, async (message) => {
        console.log(`Handling message from topic ${topic}`, message.data);
       
        await this.saveNotifications(message.data)
        await message.done()
      });
    }
    
    this.storage = storage
    this.db = db
    this.logger = logger
  }

  async start() {
    await this.messaging.connect();
    const receiver = this.messaging.attachReceiver();
    // await this.messaging.subscribe(["emp/transfer/SG01-0001", "emp/transfer/8510-0002"])
    await this.messaging.subscribe(this.topics)
    receiver.on("data", (message) => {
        let msg = {};
        const topic = message.source?.properties?.to
        try {
            if(message.source?.properties?.contentType === 'application/json'){
               msg.data =  JSON.parse(message.payload?.data)

            }
            else{
                msg.data =  message.payload?.data
            }
          } catch (error) {
            console.error("Error in received message: ", error)
          }
          msg.done = message.done
        this.handlers.emit(topic, msg);
      });
  }

  async stop() {
    await this.messaging.disconnect();
  }

  async saveNotifications(msg){

    const payload = {
        EMPNAME: msg.name, 
        EMPID: msg.userId, 
        COUNTRY: msg.country, 
        CITY: msg.locationDesc, 
        DEPARTMENT: msg.department, 
        BUSINESSUNIT: msg.businessUnit, 
        JOBTITLE: msg.jobTitle, 
        EMPEMAIL: msg.email, 
        EXTERNALID: v4(),
        REASON: msg.reason
      }
    await this.storage.create(this.logger, this.db, payload) 
  }
}
