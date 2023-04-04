
import {Client} from '@sap/xb-msg-amqp-v100'
import axios from 'axios'

export default class MessagingService {
  constructor(url, username, password, queue, management) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.connection = null;
    this.receivers = new Map();
    this.queue = queue
    this.management = management
  }

  async connect() {

    return new Promise((resolve) => {
        const amqp = new Client({
            uri: [this.url],
            sasl: {
                user: this.username,
                password: this.password,
                mechanism: "PLAIN"
            }
        })
        amqp.connect()
        amqp.on("connected", (destination, peerInfo)=>{
            console.info("Connected to Message Broker: ", destination, peerInfo.description)
            this.connection = amqp
            resolve()
        })
        .on('error', (error) => {
            console.error(error);
          })
        .on('disconnected', (error) => {
            console.log(error);
          })

    })
    
  }

  async createSubscription(topic = "") {
    try{
        const response = await axios({
            method: 'POST',
            url: `${this.management?.uri}/msgVpns/${this.management.msgVpnName}/queues/${this.queue}/subscriptions`,
            data: {
                subscriptionTopic: topic
            },
            auth: {
                username: this.management.username,
                password: this.management.password,
              }
        })
        console.log(`Subscribed to topic: "${topic}"`);
        return response.data
    }
    catch(error){
        if (error.response && error.response.status === 400) {
            console.log(`Subscription topic "${topic}" already exists in the queue "${this.queue}"`);
          } else {
            throw error;
          }
    }

  }

 async subscribe(topics = []) {
    if(!Array.isArray(topics)) console.error("subscribe expects list of topics")

    for(const topic of topics){
        await this.createSubscription(topic)
    }

  }

  attachReceiver(){
    return this.connection.receiver(this.queue).attach(this.queue)

  }

  async publish(topic, message) {
    await this.connection.createSender(topic);
    await this.connection.send(message);
  }

  async close() {
    await this.connection.close();
  }

  async receiveMessage(topic) {
    return new Promise((resolve) => {
      this.receivers.get(topic).on("message", (message) => {
        resolve(message.getData());
      });
    });
  }

  disconnect(){
     this.connection.disconnect()
  }

  static connectionString(username, password, port, url){
    return `amqps://${username}:${password}@${url}:${port}`
  }
}
