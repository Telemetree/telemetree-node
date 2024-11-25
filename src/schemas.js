class BotTrackingConfig {
    constructor(data) {
        this.validate(data);
        Object.assign(this, data);
    }

    validate(data) {
        const requiredFields = ['host', 'auto_capture_telegram_events', 'auto_capture_commands'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (!Array.isArray(data.auto_capture_telegram_events)) {
            throw new Error('auto_capture_telegram_events must be an array');
        }

        if (!Array.isArray(data.auto_capture_commands)) {
            throw new Error('auto_capture_commands must be an array');
        }
    }
}

class EncryptedEvent {
    constructor(data) {
        this.validate(data);
        Object.assign(this, data);
    }

    validate(data) {
        const requiredFields = ['encrypted_message', 'encrypted_key', 'encrypted_iv'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    }
}

module.exports = {
    BotTrackingConfig,
    EncryptedEvent
};
