class BaseUser {
  constructor(data) {
    this.entity_id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name || null;
    this.username = data.username || null;
  }
}

class FromUser extends BaseUser {
  constructor(data) {
    super(data);
    this.is_bot = data.is_bot;
    this.language_code = data.language_code || null;
    this.is_premium = data.is_premium || null;
  }
}

class Chat extends BaseUser {
  constructor(data) {
    super(data);
    this.type = data.type;
  }
}

class Message {
  constructor(data) {
    this.message_id = data.message_id;
    this.from_user = new FromUser(data.from);
    this.chat = new Chat(data.chat);
    this.date = data.date;
    this.text = data.text;
  }
}

class EditedMessage extends Message {
  constructor(data) {
    super(data);
    this.edit_date = data.edit_date;
  }
}

class InlineQuery {
  constructor(data) {
    this.entity_id = data.id;
    this.from_user = new FromUser(data.from);
    this.query = data.query;
    this.offset = data.offset;
  }
}

class Update {
  constructor(data, appName) {
    this.update_id = data.update_id;
    this.app_name = appName;
    this.message = data.message ? new Message(data.message) : null;
    this.edited_message = data.edited_message
      ? new EditedMessage(data.edited_message)
      : null;
    this.inline_query = data.inline_query
      ? new InlineQuery(data.inline_query)
      : null;
    this.event_source = "node-sdk";
  }
}

module.exports = {
  BaseUser,
  FromUser,
  Chat,
  Message,
  EditedMessage,
  InlineQuery,
  Update
};
