export default class Storage {
    static READ_NOTIFACTIONS = 'SELECT * FROM NOTIFICATIONS'
    static CREATE_NOTIFICATIONS = `INSERT INTO NOTIFICATIONS (EMPNAME, EMPID, COUNTRY, CITY, DEPARTMENT, BUSINESSUNIT, JOBTITLE, EMPEMAIL, EXTERNALID, REASON) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
    static UPDATE_WRKSTATION = `UPDATE NOTIFICATIONS SET (WRKBUILDING, WRKFLOOR, WRKSTATION, WRKDESKKEYS) = ($2, $3, $4, $5) WHERE EXTERNALID = $1`
    static EXISTS = 'SELECT EXISTS(SELECT 1 FROM NOTIFICATIONS WHERE EXTERNALID=$1)'
   static async readAll (db, logger) {
        try {
          logger.debug('Reading all notifications')
          const  rows  = await this.query(db, Storage.READ_NOTIFACTIONS)
          
          logger.debug('Successfully read all notifications - %O', rows)
          return rows
        } catch (error) {
          const { message } = error
          logger.error('Error reading all notifications - %s', message)
          throw error
        }
      }
  
      static async create (logger, db, { EMPNAME = '', EMPID = '', COUNTRY = '', CITY = '', DEPARTMENT = '', BUSINESSUNIT= '', JOBTITLE = '', EMPEMAIL = '', EXTERNALID= '', REASON= '' } = {}) {
        try {
          logger.debug('Creating notification: %O', { EMPNAME, EMPID, COUNTRY, CITY, DEPARTMENT, BUSINESSUNIT, JOBTITLE, EMPEMAIL, EXTERNALID })
          const result = await db.query(Storage.CREATE_NOTIFICATIONS, [EMPNAME, EMPID, COUNTRY, CITY, DEPARTMENT, BUSINESSUNIT, JOBTITLE, EMPEMAIL, EXTERNALID, REASON])
          logger.debug('Successfully created notification: %O - %d', { EMPNAME, EMPID, COUNTRY, CITY, DEPARTMENT, BUSINESSUNIT, JOBTITLE, EMPEMAIL, EXTERNALID }, result)
          return result
        } catch (error) {
          const { message } = error
          logger.error('Error creating notification: %O - %s', { EMPNAME, EMPID, COUNTRY, CITY, DEPARTMENT, BUSINESSUNIT, JOBTITLE, EMPEMAIL, EXTERNALID }, message)
          throw error
        }
      }

      static async update (logger, db, { WRKBUILDING='', WRKFLOOR='', WRKSTATION='', WRKDESKKEYS='NO', EXTERNALID } = {}) {
        try {
          const result = await this.query(db, Storage.UPDATE_WRKSTATION, [EXTERNALID, WRKBUILDING, WRKFLOOR, WRKSTATION, WRKDESKKEYS])
          return result
        } catch (error) {
          const { message } = error
          logger.error('Error updating notification: %O - %s', { WRKBUILDING, WRKFLOOR, WRKSTATION, EXTERNALID }, message)
          throw error
        }
      }


      async #checkId (db, id) {
      
        const result = await db.query(Storage.EXISTS, [id])
        console.log("exists = ", result)
        if (!result) {
          const message = util.format('No notifications found for id: %s', id)
          throw new Error(message)
        }
      }

      static async query(client, sql, args) {
        return new Promise((resolve, reject) => {
          client.exec(sql, args, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
          });
        });
      }
}