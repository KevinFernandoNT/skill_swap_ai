import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = new this.notificationModel(data);
    return notification.save();
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({
      recipient: userId,
      isDeleted: false
    }).populate('sender', 'name avatar').populate('exchangeRequestId').populate('sessionId').sort({ createdAt: -1 }).exec();
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({
      recipient: userId,
      isRead: false,
      isDeleted: false
    }).populate('sender', 'name avatar').populate('exchangeRequestId').populate('sessionId').sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    ).exec();
  }

  async deleteNotification(notificationId: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isDeleted: true },
      { new: true }
    ).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false
    }).exec();
  }
} 