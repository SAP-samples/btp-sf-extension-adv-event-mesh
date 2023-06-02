import application from "../../srv/application";
import AppController from "../../srv/lib/app-controller";
import Database from "../../srv/lib/database/db-service.js";
import Storage from "../../srv/lib/database/storage";
import MessagingService from "../../srv/lib/messaging/messaging-service";
import { Client } from "@sap/xb-msg-amqp-v100";
import log from "cf-nodejs-logging-support";
import EventEmitter from "events";
const supertest = require("supertest");
const db = require("./database");
let ExternalID;
let request;

jest.mock("@sap/xb-msg-amqp-v100", () => {
  const mockClient = {
    connect: jest.fn(),
    on: jest.fn(),
  };
  return { Client: jest.fn(() => mockClient) };
});

jest.mock("../../srv/lib/util/hana-client", () => {
  const db = require("./database");
  return {
    middleware: jest.fn(() =>
      jest.fn((req, res, next) => {
        (req.db = db), next();
      })
    ),
  };
});

jest.spyOn(Database.prototype, "connect").mockImplementation(() => {
  return db;
});

const mockAmqpClient = new Client({});
jest.spyOn(MessagingService.prototype, "connect").mockImplementation(() => {
  mockAmqpClient.on.mockImplementation((event, cb) => {
    return {
      on: jest.fn().mockImplementation(() => {
        return {
          on: jest.fn(),
        };
      }),
    };
  });
});

jest.spyOn(MessagingService.prototype, "attachReceiver").mockImplementation(() => {
  return {
    on: jest.fn(),
  };
});

jest.spyOn(MessagingService.prototype, "createSubscription").mockImplementation(() => {
  return (MessagingService.management = "test");
});

const messagingService = new MessagingService();
messagingService.connection = {
  receiver: jest.fn({
    attach: jest.fn(),
  }),
};

jest.spyOn(messagingService.connection, "receiver").mockImplementation(() => {
  return {
    on: jest.fn().mockImplementation((event, listener) => {
      listener({ getData: () => "test" });
    }),
  };
});

describe("Advanced Event Mesh Integration Test", () => {
  beforeAll(async () => {
    const app = await application(log);
    request = supertest(app);
  })

  afterAll(() => {
    const deleteQuery = "DROP TABLE IF EXISTS NOTIFICATIONS";
    db.run(deleteQuery);
    db.close();
  })

  it("GET /api/v1/Notifications should return 200", async () => {
    const response = await request.get("/api/v1/Notifications");
    expect(response.status).toEqual(200);
  });

  it("Push new message to event queue using event emitter and verify", async () => {
    let empName;
    const body = {
      data: {
        businessUnit: "Products",
        country: "AUS",
        department: "Engineering AU",
        email: "Simon.Rampal@bestrunsap.com",
        jobTitle: "Engineering Intern",
        locationCode: "8510-0001",
        locationDesc: "Sydney",
        name: "Testing name",
        reason: "LOC_CHG",
        userId: "106003"
      },
      done: jest.fn()
    };

    const newEvent = new EventEmitter();
    new AppController(newEvent, "test", "username", "password", "mgmt", Storage, db, log);
    newEvent.emit('emp/transfer/SG01-0001', body);

    const response = await request.get("/api/v1/Notifications");

    const parsedData = JSON.parse(response.text);
    parsedData.Notifications.filter((row) => {
      if (row.EMPNAME === "Testing name") {
        ExternalID = row.EXTERNALID;
        empName = row.EMPNAME;
        return;
      }
    });
    expect(response.status).toEqual(200);
    expect(empName).toBe("Testing name");
  });

  it("Update workstation using external ID", async () => {
    const querySpy = jest.spyOn(Storage, "query");
    querySpy.mockImplementation((client, sql, args) => {
      const query = `UPDATE NOTIFICATIONS SET WRKBUILDING = ?, WRKFLOOR = ?, WRKSTATION = ?, WRKDESKKEYS = ? WHERE EXTERNALID = ?`;
      const params = [args[1], args[2], args[3], args[4], args[0]];

      db.run(query, params, function (err) {
        if (err) {
          console.error("Error executing update query:", err);
          return;
        }
      });
    });


    const response = await request
      .post(`/api/v1/Notifications/${ExternalID}/workstation`)
      .send({
        WRKBUILDING: "test-workbuilding",
        WRKFLOOR: "test-workfloor",
        WRKSTATION: "test-workstation",
      });
    expect(response.status).toEqual(204);
    querySpy.mockRestore();
  });

  it("GET /api/v1/Notifications to check workstation updated", async () => {
    const response = await request.get("/api/v1/Notifications");
    expect(response.status).toEqual(200);
    expect(response.text).toMatch(/test-workbuilding/)
  });
});
