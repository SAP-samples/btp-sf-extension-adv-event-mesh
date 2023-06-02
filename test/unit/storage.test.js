import Storage from "../../srv/lib/database/storage";
let dbMock = {};
describe("Storage", () => {
  let storage, db, logger;

  beforeEach(() => {
    db = jest.fn();
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
    };
    storage = new Storage();
  });

  describe("query", () => {
    it("should resolve with rows when client.exec succeeds", async () => {
      const mockClient = {
        exec: jest.fn(),
      };

      const sql = "SELECT * FROM users WHERE id = ?";
      const args = [123];

      const expectedRows = [{ id: 123, name: "John" }];
      mockClient.exec.mockImplementation((q, a, callback) => {
        callback(null, expectedRows);
      });

      const rows = await Storage.query(mockClient, sql, args);

      expect(mockClient.exec).toHaveBeenCalledWith(
        sql,
        args,
        expect.any(Function)
      );
      expect(rows).toEqual(expectedRows);
    });

    it("should reject with error when client.exec fails", async () => {
      const mockClient = {
        exec: jest.fn(),
      };
      const sql = "SELECT * FROM users WHERE id = ?";
      const args = [123];

      const expectedError = new Error("Database error");
      mockClient.exec.mockImplementation((q, a, callback) => {
        callback(expectedError, null);
      });

      await expect(Storage.query(mockClient, sql, args)).rejects.toEqual(
        expectedError
      );
    });
  });

  describe("readAll", () => {
    it("To read all the notifications", async () => {
      const querySpy = jest.spyOn(Storage, "query").mockImplementation(() => {
        return {
          rows: [],
        };
      });

      await Storage.readAll(dbMock, logger);
      expect(querySpy).toHaveBeenCalled();
    });

    it("should throw an error if there was an error reading notifications", async () => {
      const error = new Error("Database error");
      Storage.READ_NOTIFACTIONS = "SELECT * FROM notifications";

      Storage.query = jest.fn(() => Promise.reject(error));

      try {
        await Storage.readAll(db, logger);
      } catch (err) {
        expect(Storage.query).toHaveBeenCalledWith(
          db,
          "SELECT * FROM notifications"
        );
        expect(logger.debug).toHaveBeenCalledWith("Reading all notifications");
        expect(logger.error).toHaveBeenCalledWith(
          "Error reading all notifications - %s",
          error.message
        );
        expect(err).toBe(error);
      }
    });
  });

  describe("create", () => {
    it("To create the notification", async () => {
      dbMock = {
        query: jest.fn(),
      };

      await Storage.create(logger, dbMock, {});
      expect(dbMock.query).toHaveBeenCalled();
    });

    it("should throw an error if there was an error creating notifications", async () => {
      const error = new Error("Database error");
      dbMock = {
        query: jest.fn(),
      };

      dbMock.query = jest.fn(() => Promise.reject(error));

      try {
        await Storage.create(logger, dbMock, {});
      } catch (err) {
        expect(dbMock.query).toHaveBeenCalledWith(
          Storage.CREATE_NOTIFICATIONS,
          ["", "", "", "", "", "", "", "", "", ""]
        );
        expect(logger.error).toHaveBeenCalledWith(
          "Error creating notification: %O - %s",
          {
            BUSINESSUNIT: "",
            CITY: "",
            COUNTRY: "",
            DEPARTMENT: "",
            EMPEMAIL: "",
            EMPID: "",
            EMPNAME: "",
            EXTERNALID: "",
            JOBTITLE: "",
          },
          error.message
        );
        expect(err).toBe(error);
      }
    });
  });

  describe("update", () => {
    it("to update the notification", async () => {
      const querySpy = jest.spyOn(Storage, "query").mockImplementation(() => {
        return {
          result: [],
        };
      });

      await Storage.update(logger, dbMock, {});
      expect(querySpy).toHaveBeenCalled();
    });

    it("should throw an error if there was an error updating notifications", async () => {
      const error = new Error("Database error");

      Storage.query = jest.fn(() => Promise.reject(error)); // mock the query method

      try {
        await Storage.update(logger, db, {
          WRKBUILDING: "",
          WRKFLOOR: "",
          WRKSTATION: "",
          WRKDESKKEYS: "NO",
          EXTERNALID: "111",
        });
      } catch (err) {
        expect(Storage.query).toHaveBeenCalledWith(
          db,
          Storage.UPDATE_WRKSTATION,
          ["111", "", "", "", "NO"]
        );
        expect(logger.error).toHaveBeenCalledWith(
          "Error updating notification: %O - %s",
          { EXTERNALID: "111", WRKBUILDING: "", WRKFLOOR: "", WRKSTATION: "" },
          error.message
        );
        expect(err).toBe(error);
      }
    });
  });
});
