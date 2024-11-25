const Config = require("./config");
const EncryptionService = require("./encryption");
const EventBuilder = require("./event_builder");
const HttpClient = require("./http_client");

class TelemetreeClient {
  constructor(projectId, apiKey) {
    this.settings = new Config(projectId, apiKey);
  }

  async initialize() {
    await this.settings.initialize();
    this.encryption = new EncryptionService(this.settings.config.publicKey);
    this.eventBuilder = new EventBuilder(this.settings);
    this.httpClient = new HttpClient(this.settings);
  }

  async track(eventName, eventProperties = {}) {
    if (!eventName) {
      throw new Error("Event name is not set.");
    }

    const eventData = {
      ...this.eventBuilder.buildPayload({}, eventName),
      event: {
        ...this.eventBuilder.buildPayload({}, eventName).event,
        params: eventProperties
      }
    };

    const encryptedData = this.encryption.encrypt(JSON.stringify(eventData));
    try {
      const payload = {
        body: encryptedData.body,
        key: encryptedData.key,
        iv: encryptedData.iv
      };
      await this.httpClient.post(payload);
    } catch (error) {
      console.error("Failed to track event:", error);
      throw error;
    }
  }

  async trackUpdate(updateData) {
    const parsedUpdate = this.eventBuilder.parseTelegramUpdate(updateData);
    if (!parsedUpdate) {
      return;
    }

    const encryptedData = this.encryption.encrypt(JSON.stringify(parsedUpdate));
    try {
      const payload = {
        body: encryptedData.body,
        key: encryptedData.key,
        iv: encryptedData.iv
      };
      await this.httpClient.post(payload);
    } catch (error) {
      console.error("Failed to track update:", error);
      throw error;
    }
  }
}

module.exports = TelemetreeClient;
