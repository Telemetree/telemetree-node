const { Update } = require("./telegram_schemas");

class EventBuilder {
  constructor(settings) {
    this.settings = settings;
    this.config = settings.config;
    this.eventsToTrack = new Set(this.config.auto_capture_telegram_events);
    this.commandsToTrack = new Set(this.config.auto_capture_commands);
    this.projectId = settings.projectId;
    this.appName = this.config.app_name;
  }

  buildPayload(update, eventType) {
    const from = this._getFromUser(update);
    const sessionId = new Date().getTime().toString(); // Millisecond timestamp as session ID

    const userDetails = {
      username: from.username || "",
      firstName: from.first_name || "",
      lastName: from.last_name || "",
      isPremium: Boolean(from.is_premium),
      writeAccess: Boolean(from.allows_write_to_pm),
      telegramId: from.id,
      languageCode: from.language_code || null
    };

    const eventDetails = this._extractEventDetails(update, eventType);

    return {
      applicationId: this.projectId,
      eventType: eventType,
      eventSource: "telegram",
      timestamp: Math.floor(Date.now() / 1000),
      sessionId: sessionId,
      platform: "telegram",
      chatType: this._getChatType(update),
      chatInstance: this._getChatInstance(update),
      user: userDetails,
      event: eventDetails,
      isSystemEvent: false
    };
  }

  _getChatType(update) {
    if (update.message?.chat) {
      return update.message.chat.type;
    }
    return "N/A";
  }

  _getChatInstance(update) {
    if (update.callback_query?.chat_instance) {
      return update.callback_query.chat_instance;
    }
    return "0";
  }

  _getFromUser(update) {
    // Extract user information from various update types
    if (update.message) return update.message.from;
    if (update.edited_message) return update.edited_message.from;
    if (update.channel_post) return update.channel_post.from;
    if (update.edited_channel_post) return update.edited_channel_post.from;
    if (update.callback_query) return update.callback_query.from;
    if (update.inline_query) return update.inline_query.from;

    // Default empty user object if no user info found
    return {
      id: 0,
      is_premium: false,
      username: "",
      first_name: "",
      last_name: "",
      language_code: null
    };
  }

  _extractEventDetails(update, eventType) {
    const details = {
      type: eventType,
      params: {}
    };

    switch (eventType) {
      case "message":
        details.params = {
          text: update.message?.text,
          messageId: update.message?.message_id,
          date: update.message?.date,
          chat: update.message?.chat
        };
        break;
      case "command":
        const [command, ...args] = update.message.text.split(" ");
        details.params = {
          command: command.substring(1),
          args: args,
          messageId: update.message.message_id,
          date: update.message.date,
          chat: update.message.chat
        };
        break;
      case "callback_query":
        details.params = {
          queryId: update.callback_query?.id,
          data: update.callback_query?.data,
          messageId: update.callback_query?.message?.message_id,
          chatInstance: update.callback_query?.chat_instance
        };
        break;
      case "inline_query":
        details.params = {
          queryId: update.inline_query?.id,
          query: update.inline_query?.query,
          offset: update.inline_query?.offset
        };
        break;
    }

    return details;
  }

  parseTelegramUpdate(updateDict) {
    const update = new Update(updateDict, this.appName);
    return this.shouldTrackUpdate(update) ? update : null;
  }

  _determineEventType(update) {
    if (update.message?.text?.startsWith("/")) {
      return "command";
    } else if (update.message) {
      return "message";
    } else if (update.edited_message) {
      return "edited_message";
    } else if (update.callback_query) {
      return "callback_query";
    } else if (update.inline_query) {
      return "inline_query";
    } else if (update.channel_post) {
      return "channel_post";
    } else if (update.edited_channel_post) {
      return "edited_channel_post";
    }
    return "unknown";
  }

  shouldTrackUpdate(update) {
    if (this._isTrackableMessageEvent(update)) {
      return this._shouldTrackMessage(update);
    }
    return this._shouldTrackEvent(update);
  }

  _isTrackableMessageEvent(update) {
    return (
      this.eventsToTrack.has("message") &&
      (update.message || update.edited_message)
    );
  }

  _shouldTrackMessage(update) {
    const messageText = update.message
      ? update.message.text
      : update.edited_message
      ? update.edited_message.text
      : null;

    return (
      this.commandsToTrack.size === 0 ||
      Array.from(this.commandsToTrack).some(
        command => messageText && messageText.includes(command)
      )
    );
  }

  _shouldTrackEvent(update) {
    return Array.from(this.eventsToTrack).some(
      event => update[event] !== null && update[event] !== undefined
    );
  }
}

module.exports = EventBuilder;
