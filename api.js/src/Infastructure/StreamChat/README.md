# Stream Chat Integration

This module provides server-side Stream Chat functionality for the SkillSwap AI application.

## Setup

1. **Environment Variables**
   Add the following to your `.env` file:
   ```
   STREAM_API_KEY=your-stream-api-key
   STREAM_API_SECRET=your-stream-api-secret
   ```

2. **Installation**
   The `stream-chat` package should already be installed in the backend.

## Usage

### Import the Module
```typescript
import { StreamChatModule } from '../Infastructure/StreamChat/stream-chat.module';
```

### Use the Service
```typescript
import { StreamChatService } from '../Infastructure/StreamChat/stream-chat.service';

@Injectable()
export class YourService {
  constructor(private streamChatService: StreamChatService) {}

  async generateToken(userId: string) {
    return this.streamChatService.generateUserToken(userId);
  }

  async createChannel(userId1: string, userId2: string) {
    return this.streamChatService.getOrCreateChannel(userId1, userId2);
  }
}
```

## API Endpoints

The following endpoints are available through the MessagesController:

- `GET /messages/stream/token` - Generate Stream Chat user token
- `GET /messages/stream/channels` - Get user's Stream Chat channels
- `POST /messages/stream/channels` - Create or get a channel between two users
- `POST /messages/stream/channels/:channelId/messages` - Send a message to a channel

## Frontend Integration

The frontend `MessagesPage.tsx` component now:
1. Fetches the Stream Chat token from the backend
2. Initializes the Stream Chat client
3. Renders the chat interface using Stream Chat React components

## Notes

- The server-side client uses the API secret for administrative operations
- User tokens are generated server-side for security
- Channel IDs are generated consistently between two users
- The integration maintains both MongoDB (for persistence) and Stream Chat (for real-time messaging) 