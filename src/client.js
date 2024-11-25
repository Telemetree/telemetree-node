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

  async trackUpdate(update) {
    if (!this.eventBuilder.shouldTrackUpdate(update)) {
      return;
    }

    const parsedUpdate = this.eventBuilder.parseTelegramUpdate(update);
    const encryptedData = this.encryption.encrypt(JSON.stringify(parsedUpdate));

    try {
      await this.httpClient.post(encryptedData);
    } catch (error) {
      console.error("Failed to track update:", error);
      throw error;
    }
  }
}

module.exports = TelemetreeClient;
