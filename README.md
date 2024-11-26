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

## Quick Start

1. First, obtain your Telemetree API credentials:
   - Project ID
   - API Key

2. Initialize the Telemetree client in your bot:

```javascript
const { TelemetreeClient } = require('@tonsolutions/telemetree-node');

const telemetree = new TelemetreeClient(
    process.env.TELEMETREE_PROJECT_ID,
    process.env.TELEMETREE_API_KEY
);

// Initialize the client before using
await telemetree.initialize();
```

3. Set up event tracking in your bot handlers:

```javascript
// Example with node-telegram-bot-api
bot.on('message', async (msg) => {
    try {
        // Track the update
        const response = await telemetree.trackUpdate(msg);
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

### Custom Event Tracking

You can also track custom events:

```javascript
await telemetree.trackEvent({
    event_type: 'custom_event',
    event_data: {
        // your custom data
    }
});
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
- React SDK: https://github.com/TONSolutions/telemetree-react
- Javascript integration: https://github.com/TONSolutions/telemetree-pixel
- Python SDK: https://github.com/TONSolutions/telemetree-python
- .NET SDK: https://github.com/MANABbl4/Telemetree.Net (community-supported)

### License

This SDK is licensed under the MIT License.
