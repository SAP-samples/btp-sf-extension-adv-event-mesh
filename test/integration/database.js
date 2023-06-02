const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("eventMesh.db");

db.query = jest.fn((query, callback) => {
  db.run(query, callback);
});

db.exec = function (sql, args, callback) {
  db.all(sql, args, function (err, rows) {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};

const createQuery = `
  CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
      EMPNAME TEXT,
      EMPID INTEGER,
      COUNTRY TEXT,
      CITY TEXT,
      DEPARTMENT TEXT,
      BUSINESSUNIT TEXT,
      JOBTITLE TEXT,
      EMPEMAIL TEXT,
      EXTERNALID INTEGER,
      REASON TEXT,
      WRKBUILDING TEXT,
      WRKFLOOR TEXT,
      WRKSTATION TEXT,
      WRKDESKKEYS TEXT
  )`;

db.run(createQuery);

module.exports = db;
