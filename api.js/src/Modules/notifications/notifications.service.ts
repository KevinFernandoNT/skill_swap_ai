import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { Types } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(private repo: NotificationsRepository) {}

  async create(data: Partial<any>): Promise<any> {
    return this.repo.create(data);
  }

  async findByUserId(userId: string): Promise<any[]> {
    return this.repo.findByUserId(userId);
  }

  async findUnreadByUserId(userId: string): Promise<any[]> {
    return this.repo.findUnreadByUserId(userId);
  }

  async markAsRead(notificationId: string): Promise<any> {
    return this.repo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return this.repo.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string): Promise<any> {
    return this.repo.deleteNotification(notificationId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repo.getUnreadCount(userId);
  }

  async createExchangeRequestNotification(
    recipientId: string,
    senderId: string,
    exchangeRequestId: string,
    sessionId: string,
    type: 'accepted' | 'rejected',
    sessionTitle: string,
    offeredSkill: string,
    requestedSkill: string
  ): Promise<any> {
    const title = `Exchange Request ${type === 'accepted' ? 'Accepted' : 'Rejected'}`;
    const message = type === 'accepted' 
      ? `Your exchange request for "${sessionTitle}" has been accepted! You offered "${offeredSkill}" in exchange for "${requestedSkill}".`
      : `Your exchange request for "${sessionTitle}" has been rejected. You offered "${offeredSkill}" in exchange for "${requestedSkill}".`;

    return this.repo.create({
      recipient: new Types.ObjectId(recipientId),
      sender: new Types.ObjectId(senderId),
      exchangeRequestId: new Types.ObjectId(exchangeRequestId),
      sessionId: new Types.ObjectId(sessionId),
      title,
      message,
      type: `exchange_request_${type}`,
      isRead: false,
      isDeleted: false
    });
  }
} 