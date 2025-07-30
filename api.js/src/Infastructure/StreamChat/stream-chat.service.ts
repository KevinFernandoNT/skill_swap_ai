import { Injectable } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import configuration from '../../config/configuration';

@Injectable()
export class StreamChatService {
  private streamServerClient: StreamChat;

  constructor() {
    const apiKey = configuration().stream.apiKey;
    const apiSecret = configuration().stream.apiSecret;
    this.streamServerClient = StreamChat.getInstance(apiKey, apiSecret);
  }
  /**
   * Generate a user token for Stream Chat
   */
  generateUserToken(userId: string): string {
    return this.streamServerClient.createToken(userId);
  }

  /**
   * Create a messaging channel between two users
   */
  async createMessagingChannel(userId1: string, userId2: string, channelData?: any) {
    const channelId = this.generateChannelId(userId1, userId2);
    
    const channel = this.streamServerClient.channel('messaging', channelId, {
      members: [userId1, userId2],
      ...channelData,
    });

    await channel.create();
    return channel;
  }

  /**
   * Get or create a channel between two users
   */
  async getOrCreateChannel(userId1: string, userId2: string) {
    const channelId = this.generateChannelId(userId1, userId2);
    
    try {
      // Try to get existing channel
      const channel = this.streamServerClient.channel('messaging', channelId);
      await channel.watch();
      return channel;
    } catch (error) {
      // Create new channel if it doesn't exist
      return this.createMessagingChannel(userId1, userId2);
    }
  }

  /**
   * Get user's channels
   */
  async getUserChannels(userId: string) {
    const filter = { members: { $in: [userId] } };
    const sort = { last_message_at: -1 };
    
    const result = await this.streamServerClient.queryChannels(filter);
    return result;
  }

  /**
   * Get channel messages
   */
  async getChannelMessages(channelId: string, limit = 50, offset = 0) {
    const channel = this.streamServerClient.channel('messaging', channelId);
    await channel.watch();
    
    // Get messages using the channel state
    const messages = channel.state.messages.slice(offset, offset + limit);
    return messages;
  }

  /**
   * Send a message to a channel
   */
  async sendMessage(channelId: string, userId: string, messageText: string, messageData?: any) {
    const channel = this.streamServerClient.channel('messaging', channelId);
    
    const message = await channel.sendMessage({
      text: messageText,
      user_id: userId,
      ...messageData,
    });
    
    return message;
  }

  /**
   * Generate a consistent channel ID for two users
   */
  private generateChannelId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure consistent channel ID regardless of order
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`;
  }

  /**
   * Update user data in Stream Chat
   */
  async updateUser(userId: string, userData: any) {
    var res =  await this.streamServerClient.upsertUser({
      id: userId,
      ...userData,
    });

    var token =  await this.streamServerClient.createToken(userId)

    console.log("TOKEN >>",token)

    return res
  }

  /**
   * Delete a channel
   */
  async deleteChannel(channelId: string) {
    const channel = this.streamServerClient.channel('messaging', channelId);
    return await channel.delete();
  }

  /**
   * Query a user by userId
   */
  async getUserById(userId: string) {
    const result = await this.streamServerClient.queryUsers({ id: { $eq: userId } });
    if (result.users && result.users.length > 0) {
      return result.users[0];
    }
    return null;
  }
} 