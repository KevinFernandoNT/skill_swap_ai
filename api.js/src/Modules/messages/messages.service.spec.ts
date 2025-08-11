import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { StreamChatService } from '../../Infastructure/StreamChat/stream-chat.service';

describe('MessagesService', () => {
  let service: MessagesService;
  const mockRepo = {
    getConversations: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
  } as any;
  const mockStream = {
    generateUserToken: jest.fn(),
    getOrCreateChannel: jest.fn(),
    getUserChannels: jest.fn(),
    sendMessage: jest.fn(),
    updateUser: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: MessagesRepository, useValue: mockRepo },
        { provide: StreamChatService, useValue: mockStream },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('sends a message (db)', async () => {
    const saved = { _id: 'm1', content: 'Hello' } as any;
    mockRepo.sendMessage.mockResolvedValue(saved);
    await expect(service.sendMessage('u1', 'c1', { content: 'Hello' } as any)).resolves.toEqual(saved);
  });

  it('generates stream user token', async () => {
    mockStream.generateUserToken.mockResolvedValue('token');
    await expect(service.generateUserToken('u1')).resolves.toBe('token');
  });

  it('sends a stream message', async () => {
    const res = { id: 'm1' } as any;
    mockStream.sendMessage.mockResolvedValue(res);
    await expect(service.sendStreamMessage('ch1', 'u1', 'hi')).resolves.toEqual(res);
  });
});


