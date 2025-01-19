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

  buildPayload(update, eventType = "message", eventData = {}) {
    const from = this._getFromUser(update);

    const payload = {
      application_id: this.settings.apiKey,
      datetime: new Date().toISOString(),
      username: from.username || undefined,
      firstname: from.first_name || undefined,
      lastname: from.last_name || undefined,
      is_premium: Boolean(from.is_premium),
      telegram_id: from.id || 0,
      language: from.language_code || undefined,
      session_id: Math.floor(Date.now() / 1000),
      event_source: "node-sdk",
      event_type:
        typeof eventType === "object" ? eventType.event_type : eventType,
      app_name: this.appName,
      event_properties: eventData
    };

    // If update contains message data, include it in event properties
    if (update.message) {
      payload.event_properties = {
        ...payload.event_properties,
        message_id: update.message.message_id,
        chat_id: update.message.chat?.id,
        chat_type: update.message.chat?.type,
        text: update.message.text,
        date: update.message.date
      };
    } else if (update.edited_message) {
      payload.event_properties = {
        ...payload.event_properties,
        message_id: update.edited_message.message_id,
        chat_id: update.edited_message.chat?.id,
        chat_type: update.edited_message.chat?.type,
        text: update.edited_message.text,
        date: update.edited_message.date,
        edit_date: update.edited_message.edit_date
      };
    } else if (update.inline_query) {
      payload.event_properties = {
        ...payload.event_properties,
        query_id: update.inline_query.id,
        query: update.inline_query.query,
        offset: update.inline_query.offset
      };
    }

    return payload;
  }

  // _getChatType(update) {
  //   if (update.message?.chat) {
  //     return update.message.chat.type;
  //   }
  //   return "N/A";
  // }

  // _getChatInstance(update) {
  //   if (update.callback_query?.chat_instance) {
  //     return update.callback_query.chat_instance;
  //   }
  //   return "0";
  // }

  // _getFromUser(update) {
  //   // Extract user information from various update types
  //   let from = null;

  //   if (!update) {
  //     throw new Error("Update object is null or undefined");
  //   }

  //   if (update.message) from = update.message.from;
  //   else if (update.edited_message) from = update.edited_message.from;
  //   else if (update.channel_post) from = update.channel_post.from;
  //   else if (update.edited_channel_post) from = update.edited_channel_post.from;
  //   else if (update.callback_query) from = update.callback_query.from;
  //   else if (update.inline_query) from = update.inline_query.from;

  //   // Validate we have a proper user object with required fields
  //   if (!from) {
  //     throw new Error("No valid user data found in update object");
  //   }

  //   if (!from.id) {
  //     throw new Error("User object missing required id field");
  //   }

  //   return from;
  // }

  _getFromUser(update) {
    let from = null;

    if (!update) {
      throw new Error("Update object is null or undefined");
    }

    if (update.message) from = update.message.from;
    else if (update.edited_message) from = update.edited_message.from;
    else if (update.inline_query) from = update.inline_query.from;

    if (!from) {
      throw new Error("No valid user data found in update object");
    }

    if (!from.id) {
      throw new Error("User object missing required id field");
    }

    return from;
  }

  _extractEventDetails(update, eventType) {
    // This method is now unused as we're sending a simpler payload
    return eventType;
  }

  parseTelegramUpdate(updateDict) {
    const update = new Update(updateDict, this.appName);
    return this.shouldTrackUpdate(update) ? update : null;
  }

  // _determineEventType(update) {
  //   if (update.message?.text?.startsWith("/")) {
  //     return "command";
  //   } else if (update.message) {
  //     return "message";
  //   } else if (update.edited_message) {
  //     return "edited_message";
  //   } else if (update.inline_query) {
  //     return "inline_query";
  //   }
  //   return "unknown";
  // }

  _determineEventType(update) {
    if (update.message?.text?.startsWith("/")) {
      return "command";
    } else if (update.message) {
      return "message";
    } else if (update.edited_message) {
      return "edited_message";
    } else if (update.inline_query) {
      return "inline_query";
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
