
export default class Database {

  constructor(client, config) {
    this.client = client
    this.config = config
  }

  async connect() {
    this.connection = await this.client.createConnectionPromise(this.config)

  }

  async query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.exec(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async disconnect() {
    await this.connection.close()

  }
}


