import AppController from "../../srv/lib/app-controller";
import MessagingService from "../../srv/lib/messaging/messaging-service";
const EventEmitter = require('events');

describe("AppController", () => {
  let appControllerService;
  let messagingService;

  beforeEach(() => {
    appControllerService = new AppController(
      {
        on: jest.fn(),
      },
      "amqp://localhost:5672",
      "username",
      "password",
      {
        uri: "management.uri",
        msgVpnName: "vpnName",
        username: "managementUsername",
        password: "managementPassword",
      },
      "storage",
      "db",
      "logger"
    );

    messagingService = new MessagingService(
      "amqp://localhost:5672",
      "username",
      "password",
      "queue",
      {
        uri: "management.uri",
        msgVpnName: "vpnName",
        username: "managementUsername",
        password: "managementPassword",
      }
    );
  });

  describe("start", () => {
    let attachReceiverMock;
    let mockReceiver;
    let mockHandlers;

    beforeEach(() => {
      appControllerService.messaging = {
        connect: jest.fn(),
        attachReceiver: jest.fn(() => mockReceiver),
        subscribe: jest.fn(),
      };

      attachReceiverMock = {
        on: jest.fn(),
      };

      mockReceiver = new EventEmitter();
      mockHandlers = new EventEmitter();
      appControllerService.handlers = mockHandlers;
    });

    it("should connect to messaging and attach receiver", async () => {
      await appControllerService.start();
      const topic = 'test-topic';
      const message = {
        source: {
          properties: {
            to: topic,
            contentType: 'application/json',
          },
        },
        payload: {
          data: '{"test": "data"}',
        },
        done: true,
      };

      expect(appControllerService.messaging.connect).toHaveBeenCalled();
      expect(appControllerService.messaging.attachReceiver).toHaveBeenCalled();

      const mockHandler = jest.fn();
      mockHandlers.on(topic, mockHandler);
      mockReceiver.emit('data', message);
      expect(mockHandler).toHaveBeenCalledWith({
        data: { test: 'data' },
        done: true,
      });
    });

    it("should connect to messaging and attach receiver for handling non JSON content type", async () => {
      await appControllerService.start();
      const topic = 'test-topic';
      const message = {
        source: {
          properties: {
            to: topic,
            contentType: 'application/json',
          },
        },
        payload: {
          data: 'Test string',
        },
        done: false,
      };

      expect(appControllerService.messaging.connect).toHaveBeenCalled();
      expect(appControllerService.messaging.attachReceiver).toHaveBeenCalled();

      const mockHandler = jest.fn();
      mockHandlers.on(topic, mockHandler);
      mockReceiver.emit('data', message);

      expect(mockHandler).toHaveBeenCalledWith({
        done: false,
      });
    });

    it('should connect to messaging and attach receiver for handling content type not application/json ', async () => {
      mockReceiver = {
        on: jest.fn(),
      };
  
      mockHandlers = {
        emit: jest.fn(),
      };
  
      appControllerService.handlers = mockHandlers;
  
      const message = {
        source: {
          properties: {},
        },
        payload: {
          data: 'Test string',
        },
        done: jest.fn(),
      };
  
      mockReceiver.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback(message);
        }
      });
  
      await appControllerService.start();
      mockReceiver.on.mock.calls[0][1](message);
      expect(mockHandlers.emit).toHaveBeenCalled();
    });
  });

  describe("saveNotifications", () => {
    it("should save the notifcations", async () => {
      const msgPayload = {
        name: "div",
        userId: 1102,
        country: "India",
        locationDesc: "bangalore",
        department: "engg",
        businessUnit: "btp",
        jobTitle: "developer associate",
        email: "div@sap.com",
        reason: "new joinee",
      };

      appControllerService.storage = {
        create: jest.fn(),
      };

      await appControllerService.saveNotifications(msgPayload);
      expect(appControllerService.storage.create).toHaveBeenCalled();
    });
  });

  describe("Stop", () => {
    it("app - controller disconnect", async () => {
      appControllerService.messaging = {
        disconnect: jest.fn(),
      };

      await appControllerService.stop();
      expect(appControllerService.messaging.disconnect).toHaveBeenCalled();
    });
  });
});
