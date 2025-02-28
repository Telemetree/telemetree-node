# Telemetree SDKs for Telegram Mini App Analytics

Telemetree is a comprehensive free analytics tool designed specifically for **Telegram Mini Apps**. With our SDKs, developers, marketers, and product managers can easily track and optimize user engagement, making data-driven decisions to boost user acquisition and retention. Telemetree simplifies **Analytics for Telegram Mini Apps** by delivering insights into user behaviors, acquisition channels, and in-app interactions.

## Key Features
- **Real-Time Analytics**: Monitor user activity within your Telegram Mini App in real-time.
- **User Retention Metrics**: Track returning users and pinpoint which features encourage app retention.
- **Web3 data**: discover web3 metrics associated with your users.
- **Seamless Integration**: Our SDKs are lightweight and integrate easily with auto event mapping.
- **Telegram-native**: Telemetree is built natively for Telegram.
- **User segmentation**: API for personalized notifications based on cohorts, completed actions. web3 data and more.
- **Free tier** with wide limits.

## Why Use Telemetree for Telegram Mini App Analytics?

Telemetree is uniquely focused on the needs of Telegram Mini App developers, providing tailored metrics and insights that help you grow and retain your user base efficiently. As the demand for Analytics for Telegram Mini Apps grows, Telemetree remains at the forefront, offering tools that cater specifically to the Telegram ecosystem.

Start capturing valuable insights with Telemetree and make data-driven decisions for your app's growth on Telegram.

## Resources
Consider visiting our resources for more info about the state of the Telegram Mini Apps ecosystem and Telegram analytics.

- [Website](https://www.telemetree.io/)
- [Twitter](https://x.com/telemetree_HQ)
- [Telegram channel](https://t.me/telemetree_en)
- [LinkedIn](https://linkedin.com/company/telemetree)
- [Medium](https://medium.com/@telemetree)
- [Documentation](https://docs.telemetree.io/)

## NodeJS SDK Features

- Easy integration with Telegram bot backends
- Secure event encryption
- Automatic event capturing
- Customizable event tracking
- Comprehensive error handling and logging

## Installation

```bash
npm install @tonsolutions/telemetree-node
```

## TypeScript Support

The SDK includes built-in TypeScript declarations. You can use it in your TypeScript projects with full type safety and IDE support:

```typescript
import { TelemetreeClient, TelegramUpdate } from '@tonsolutions/telemetree-node';

// Initialize with type checking
const telemetree = new TelemetreeClient(
    process.env.TELEMETREE_PROJECT_ID!,
    process.env.TELEMETREE_API_KEY!
);

// Example of typed Telegram update
const update: TelegramUpdate = {
    message: {
        message_id: 123,
        chat: {
            id: 456,
            type: 'private'
        },
        date: Date.now()
    }
};

const user: TelegramUser = {
   id: msg.from.id,
   username: msg.from.username,
   first_name: msg.from.first_name,
   last_name: msg.from.last_name,
   is_premium: msg.from.is_premium,
   language_code: msg.from.language_code,
};

// Track with type-safe properties
await telemetree.track(user, 'custom_event', {
    userId: 12345,
    action: 'purchase'
});

// Track update with type checking
await telemetree.trackUpdate(update);
```

## Quick Start

1. First, obtain your Telemetree API credentials:
   - Project ID
   - API Key

2. Initialize the Telemetree client in your bot:

```typescript
import { TelemetreeClient } from '@tonsolutions/telemetree-node';

const telemetree = new TelemetreeClient(
    process.env.TELEMETREE_PROJECT_ID,
    process.env.TELEMETREE_API_KEY
);

// Initialize the client before using
await telemetree.initialize();
```

3. Set up event tracking in your bot handlers:

```typescript
// Example with node-telegram-bot-api
bot.on('message', async (msg: any) => {
    try {
        // Track the update
       const update = {
          message: msg,
       };
        const response = await telemetree.trackUpdate(update);
        console.log('Tracking response:', response);
    } catch (error) {
        console.error('Failed to track message:', error);
    }
});
```

## Configuration

Create a `.env` file with your Telemetree credentials:

```
TELEMETREE_PROJECT_ID=your-project-id
TELEMETREE_API_KEY=your-api-key
```

## Event Tracking

The SDK automatically tracks various Telegram events:

- Messages
- Edited messages
- Commands
- Inline queries
- And more...


### Event Properties

The SDK supports two types of event properties:

1. Custom Properties (Manual Tracking):
   - Add any custom properties when tracking events manually
   - Properties are included in the `event_properties` field

2. Automatic Properties (Telegram Updates):
   - Message events include: message_id, chat_id, chat_type, text, date
   - Edited messages additionally include: edit_date
   - Inline queries include: query_id, query text, offset

Example of automatic properties in a message event:
```javascript
// Properties captured automatically when tracking updates
await telemetree.trackUpdate(msg);
// The event will include properties like:
{
    message_id: 123,
    chat_id: 456,
    chat_type: 'private',
    text: 'Hello',
    date: '2024-01-01T12:00:00Z',
    event_properties: {
        // Additional custom properties if any
    }
}
```

## Error Handling

The SDK provides comprehensive error handling:

```javascript
try {
    await telemetree.trackUpdate(update);
} catch (error) {
    if (error.name === 'CustomEventNotSupported') {
        // Handle unsupported event
    } else {
        // Handle other errors
    }
}
```

## Response Logging

The SDK provides detailed response logging:

```javascript
{
    success: true/false,
    status: 200,
    statusText: 'OK',
    data: {...},
    headers: {...},
    requestTime: '2024-11-26T01:48:24.745Z'
}
```

### Encryption

The SDK uses RSA encryption to secure event data before sending it to the Telemetree service, ensuring data privacy. The `publicKey` is fetched automatically from the Telemetree configuration service during initialization, so there’s no need to manually set it.

## Other SDKs
Telemetree SDKs are available for various frameworks and environments, making it easy to incorporate powerful analytics into any Telegram Mini App.
- React SDK: https://github.com/Telemetree/telemetree-react
- Javascript integration: https://github.com/Telemetree/telemetree-pixel
- Python SDK: https://github.com/Telemetree/telemetree-python
- .NET SDK: https://github.com/MANABbl4/Telemetree.Net (community-supported)

### License

This SDK is licensed under the MIT License.
