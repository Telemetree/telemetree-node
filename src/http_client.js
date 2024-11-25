const axios = require('axios');

class HttpClient {
    constructor(settings) {
        this.settings = settings;
        this.url = settings.config.host;
        this.apiKey = settings.apiKey;
    }

    async post(data) {
        try {
            const response = await axios.post(this.url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error posting data:', error);
            throw error;
        }
    }
}

module.exports = HttpClient;
