import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRequestsService } from './exchange-requests.service';
import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { ExchangeSessionsService } from '../exchange-sessions/exchange-sessions.service';

describe('ExchangeRequestsService', () => {
  let service: ExchangeRequestsService;
  const mockRepo = {
    create: jest.fn(),
    updateStatus: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
  };
  const mockNotifications = { create: jest.fn() } as any;
  const mockExchangeSessions = { create: jest.fn() } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRequestsService,
        { provide: ExchangeRequestsRepository, useValue: mockRepo },
        { provide: NotificationsService, useValue: mockNotifications },
        { provide: ExchangeSessionsService, useValue: mockExchangeSessions },
      ],
    }).compile();

    service = module.get<ExchangeRequestsService>(ExchangeRequestsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates an exchange request pending', async () => {
    const saved = { _id: 'er1', status: 'pending' } as any;
    mockRepo.create.mockResolvedValue(saved);
    const dto = { sessionId: 's1', recipient: 'u2', offeredSkillId: 'sk1', requestedSkillId: 'sk2' } as any;
    const result = await service.create('u1', dto);
    expect(result).toEqual(saved);
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('on accept, creates notification and exchange session', async () => {
    const id = 'er1';
    const updated = { _id: id, status: 'accepted' } as any;
    mockRepo.updateStatus.mockResolvedValue(updated);
    mockRepo.findById.mockResolvedValue({
      _id: id,
      requester: 'u1',
      recipient: 'u2',
      sessionId: 's1',
      offeredSkillId: 'sk1',
      requestedSkillId: 'sk2',
    });
    await service.updateStatus(id, 'accepted');
    expect(mockNotifications.create).toHaveBeenCalled();
    expect(mockExchangeSessions.create).toHaveBeenCalled();
  });
});


