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
    if (!this.eventBuilder) {
      throw new Error("Client not initialized. Call initialize() first.");
    }

    if (!eventName) {
      throw new Error("Event name is not set.");
    }

    const eventData = this.eventBuilder.buildPayload({}, eventName, eventProperties);

    const encryptedData = await this.encryption.encrypt(eventData);
    try {
      const payload = {
        body: encryptedData.body,
        key: encryptedData.key,
        iv: encryptedData.iv
      };
      const response = await this.httpClient.post(payload);
      if (!response.success) {
        console.error("Failed to track event:", response);
        throw new Error(
          `Tracking failed: ${response.error || "Unknown error"}`
        );
      }
      return response;
    } catch (error) {
      console.error("Failed to track event:", error);
      throw error;
    }
  }

  async trackUpdate(updateData) {
    if (!this.eventBuilder) {
      throw new Error("Client not initialized. Call initialize() first.");
    }

    const parsedUpdate = this.eventBuilder.parseTelegramUpdate(updateData);
    if (!parsedUpdate) {
      return;
    }

    // Build payload with user data and event type
    const eventType = this.eventBuilder._determineEventType(parsedUpdate);
    const eventData = this.eventBuilder.buildPayload(updateData, eventType);
    const encryptedData = await this.encryption.encrypt(eventData);
    try {
      const payload = {
        body: encryptedData.body,
        key: encryptedData.key,
        iv: encryptedData.iv
      };
      const response = await this.httpClient.post(payload);
      if (!response.success) {
        console.error("Failed to track update:", response);
        throw new Error(
          `Tracking failed: ${response.error || "Unknown error"}`
        );
      }
      return response;
    } catch (error) {
      console.error("Failed to track update:", error);
      throw error;
    }
  }
}

module.exports = TelemetreeClient;
