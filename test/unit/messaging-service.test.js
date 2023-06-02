import axios from "axios";
import { Client } from "@sap/xb-msg-amqp-v100";
import MessagingService from "../../srv/lib/messaging/messaging-service.js";

jest.mock("axios");
jest.mock("@sap/xb-msg-amqp-v100", () => {
  const mockClient = {
    connect: jest.fn(),
    on: jest.fn(),
  };
  return { Client: jest.fn(() => mockClient) };
});

describe("MessagingService", () => {
  let messagingService;

  beforeEach(() => {
    axios.mockClear();
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

  describe("connect", () => {
    let client;

    beforeEach(() => {
      client = new Client("my-amqp-url", "my-username", "my-password");
    });

    it("should connect to the message broker", async () => {
      const mockAmqpClient = new Client({});
      const connectSpy = jest.spyOn(mockAmqpClient, "connect");

      const mockOnConnectedCallback = jest.fn();
      mockAmqpClient.on.mockImplementation((event, cb) => {
        if (event === "connected") {
          mockOnConnectedCallback.mockImplementation(cb);
        }
        return {
          on: jest.fn().mockImplementation(() => {
            return {
              on: jest.fn(),
            };
          }),
        };
      });

      const promise = messagingService.connect();
      mockOnConnectedCallback("destination", { description: "peerInfo" });
      await promise;

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe("createSubscription", () => {
    it("should create a subscription to the specified topic", async () => {
      axios.mockImplementationOnce(() =>
        Promise.resolve({
          data: {},
        })
      );
      const response = await messagingService.createSubscription("topic");
      expect(response).toEqual({});
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "management.uri/msgVpns/vpnName/queues/queue/subscriptions",
        data: {
          subscriptionTopic: "topic",
        },
        auth: {
          username: "managementUsername",
          password: "managementPassword",
        },
      });
    });

    it("should return empty response if topic is not sent", async () => {
      axios.mockImplementationOnce(() =>
        Promise.resolve({
          data: {},
        })
      );
      const response = await messagingService.createSubscription();
      expect(response).toEqual({});
    });

    it("should return a message if the subscription topic already exists", async () => {
      axios.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 400,
          },
        })
      );
      const response = await messagingService.createSubscription("topic");
      expect(response).toBeUndefined();
    });

    it("should throw an error for other errors", async () => {
      axios.mockImplementationOnce(() =>
        Promise.reject({
          response: {
            status: 500,
            message: "Internal error",
          },
        })
      );

      let response;
      try {
        response = await messagingService.createSubscription("topic");
        expect(await messagingService.createSubscription("topic")).toThrow(
          error
        );
      } catch (error) {
        expect(response).not.toBeDefined();
        expect(error.response.message).toEqual("Internal error");
      }
    });
  });

  describe("subscribe", () => {
    it("should subscribe to the specified topics", async () => {
      const createSubscriptionSpy = jest
        .spyOn(messagingService, "createSubscription")
        .mockImplementation(() => {
          return {
            data: {},
          };
        });

      await messagingService.subscribe(["topic1", "topic2"]);
      expect(createSubscriptionSpy).toHaveBeenCalledTimes(2);
      expect(createSubscriptionSpy).toHaveBeenCalledWith("topic1");
      expect(createSubscriptionSpy).toHaveBeenCalledWith("topic2");
    });

    it("should not return response when topics are not sent", async () => {
      const response = await messagingService.subscribe();
      expect(response).toBeUndefined();
    });

    it("should return error", async () => {
      const response = await messagingService.subscribe("");
      expect(response).toBeUndefined();
    });
  });

  describe("publish", () => {
    it("should publish the messsage to specified topic", async () => {
      messagingService.connection = {
        createSender: jest.fn(),
        send: jest.fn(),
      };

      await messagingService.publish("topic1", "Hello");
      expect(messagingService.connection.createSender).toHaveBeenCalled();
      expect(messagingService.connection.send).toHaveBeenCalled();
    });
  });

  describe("connectionStrting", () => {
    it("should return a proper connection string", async () => {
      const username = "myUsername";
      const password = "myPassword";
      const port = 5672;
      const url = "example.com";

      MessagingService.connectionString(username, password, port, url);
      expect(
        MessagingService.connectionString(username, password, port, url)
      ).toEqual("amqps://myUsername:myPassword@example.com:5672");
    });
  });

  describe("close", () => {
    it("should close the connection", async () => {
      messagingService.connection = {
        close: jest.fn(),
      };

      await messagingService.close();
      expect(messagingService.connection.close).toHaveBeenCalled();
    });
  });

  describe("disconnect", () => {
    it("should disconnect the connection", async () => {
      messagingService.connection = {
        disconnect: jest.fn(),
      };

      await messagingService.disconnect();
      expect(messagingService.connection.disconnect).toHaveBeenCalled();
    });
  });

  describe("attachReceiver", () => {
    it("should attach receiver with queue", async () => {
      messagingService.connection = {
        receiver: jest.fn({
          attach: jest.fn(),
        }),
      };

      jest
        .spyOn(messagingService.connection, "receiver")
        .mockImplementation(() => {
          return {
            attach: jest.fn(),
          };
        });

      await messagingService.attachReceiver();
      expect(messagingService.connection.receiver).toHaveBeenCalled();
    });
  });

  describe("receiveMessage", () => {
    it("should resolve with message data", async () => {
      const messageData = "Hello, world!";
      const topic = "test-topic";

      const message = {
        getData: () => messageData,
      };

      const mockReceiver = {
        on: jest.fn().mockImplementation((event, listener) => {
          listener(message);
        }),
      };
      messagingService.receivers.set(topic, mockReceiver);

      const receivedMessageData = await messagingService.receiveMessage(topic);
      expect(receivedMessageData).toEqual(messageData);

      expect(mockReceiver.on).toHaveBeenCalledWith(
        "message",
        expect.any(Function)
      );
    });
  });
});
