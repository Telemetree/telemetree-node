# Telemetree NodeJS SDK for Telegram Bots

A powerful SDK for integrating Telemetree analytics into your Telegram bot backend.

## Features

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
