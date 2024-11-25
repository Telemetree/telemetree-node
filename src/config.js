const axios = require("axios");

class Config {
  constructor(projectId, apiKey) {
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.config = null;
  }

  async initialize() {
    this.config = await this.__fetchConfig();
  }

  async __fetchConfig() {
    try {
      const response = await axios.get(
        `https://config.ton.solutions/v1/client/config?project=${this.projectId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          }
        }
      );
      return {
        host: response.data.host,
        publicKey: response.data.public_key,
        auto_capture_telegram_events: [
          "message",
          "edited_message",
          "channel_post",
          "edited_channel_post",
          "inline_query",
          "chosen_inline_result",
          "callback_query"
        ],
        auto_capture_commands: []
      };
    } catch (error) {
      console.error("Failed to fetch config:", error);
      throw error;
    }
  }
}

module.exports = Config;
