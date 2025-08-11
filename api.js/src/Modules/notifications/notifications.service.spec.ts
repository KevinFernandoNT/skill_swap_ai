import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const mockRepo = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findUnreadByUserId: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    getUnreadCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a notification', async () => {
    const payload = { recipient: 'u1', title: 't' } as any;
    const saved = { _id: 'n1', ...payload };
    mockRepo.create.mockResolvedValue(saved);
    await expect(service.create(payload)).resolves.toEqual(saved);
    expect(mockRepo.create).toHaveBeenCalledWith(payload);
  });

  it('returns notifications by user', async () => {
    const list = [{ _id: 'n1' }];
    mockRepo.findByUserId.mockResolvedValue(list);
    await expect(service.findByUserId('u1')).resolves.toEqual(list);
    expect(mockRepo.findByUserId).toHaveBeenCalledWith('u1');
  });

  it('returns unread notifications by user', async () => {
    const list = [{ _id: 'n2', isRead: false }];
    mockRepo.findUnreadByUserId.mockResolvedValue(list);
    await expect(service.findUnreadByUserId('u1')).resolves.toEqual(list);
    expect(mockRepo.findUnreadByUserId).toHaveBeenCalledWith('u1');
  });

  it('marks one notification as read', async () => {
    const updated = { _id: 'n2', isRead: true };
    mockRepo.markAsRead.mockResolvedValue(updated);
    await expect(service.markAsRead('n2')).resolves.toEqual(updated);
    expect(mockRepo.markAsRead).toHaveBeenCalledWith('n2');
  });

  it('marks all notifications as read', async () => {
    mockRepo.markAllAsRead.mockResolvedValue(undefined);
    await expect(service.markAllAsRead('u1')).resolves.toBeUndefined();
    expect(mockRepo.markAllAsRead).toHaveBeenCalledWith('u1');
  });

  it('deletes a notification', async () => {
    const deleted = { _id: 'n3', isDeleted: true };
    mockRepo.deleteNotification.mockResolvedValue(deleted);
    await expect(service.deleteNotification('n3')).resolves.toEqual(deleted);
    expect(mockRepo.deleteNotification).toHaveBeenCalledWith('n3');
  });

  it('gets unread count', async () => {
    mockRepo.getUnreadCount.mockResolvedValue(5);
    await expect(service.getUnreadCount('u1')).resolves.toBe(5);
    expect(mockRepo.getUnreadCount).toHaveBeenCalledWith('u1');
  });
});


