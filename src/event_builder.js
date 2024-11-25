class EventBuilder {
    constructor(settings) {
        this.settings = settings;
        this.config = settings.config;
        this.eventsToTrack = new Set(this.config.auto_capture_telegram_events);
        this.commandsToTrack = new Set(this.config.auto_capture_commands);
    }

    parseTelegramUpdate(updateDict) {
        // Convert the update dictionary to a structured object
        return updateDict;
    }

    shouldTrackUpdate(update) {
        return this._shouldTrackEvent(update) || this._shouldTrackMessage(update);
    }

    _isTrackableMessageEvent(update) {
        const messageTypes = ['message', 'edited_message', 'channel_post', 'edited_channel_post'];
        return messageTypes.some(type => type in update);
    }

    _shouldTrackMessage(update) {
        if (!this._isTrackableMessageEvent(update)) {
            return false;
        }

        const message = update.message || 
                       update.edited_message || 
                       update.channel_post || 
                       update.edited_channel_post;

        if (!message) {
            return false;
        }

        // Check if it's a command and if we should track it
        if (message.text && message.text.startsWith('/')) {
            const command = message.text.split(' ')[0].substring(1);
            return this.commandsToTrack.has(command);
        }

        return true;
    }

    _shouldTrackEvent(update) {
        for (const eventType of this.eventsToTrack) {
            if (eventType in update) {
                return true;
            }
        }
        return false;
    }
}

module.exports = EventBuilder;
