const axios = require("axios");

class HttpClient {
  constructor(settings) {
    this.settings = settings;
    this.url = settings.config.host;
    this.apiKey = settings.apiKey;
    this.projectId = settings.projectId;
  }

  async post(data) {
    try {
      console.log("Making request to:", this.url);
      console.log("Headers:", {
        "X-Api-Key": this.apiKey
          ? `${this.apiKey.substr(0, 4)}...${this.apiKey.substr(-4)}`
          : "[MISSING]",
        "X-Project-Id": this.projectId
      });
      console.log("Original data structure:", {
        body_length: data.body?.length,
        key_length: data.key?.length,
        iv_length: data.iv?.length
      });

      console.log("Sending data lengths:", {
        body_length: data.body?.length,
        key_length: data.key?.length,
        iv_length: data.iv?.length
      });

      const response = await axios.post(this.url, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey,
          "X-Project-Id": this.projectId
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }
}

module.exports = HttpClient;
