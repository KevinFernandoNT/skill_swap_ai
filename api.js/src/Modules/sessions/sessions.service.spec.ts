import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { PythonApiService } from '../common/python-api.service';

describe('SessionsService', () => {
  let service: SessionsService;
  const mockRepo = {
    create: jest.fn(),
  } as any;
  const mockPython = { sendSessionData: jest.fn() } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: SessionsRepository, useValue: mockRepo },
        { provide: PythonApiService, useValue: mockPython },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a session and triggers background when subTopics present', async () => {
    const dto = { title: 'React Hooks', teachSkillId: 'skill1', subTopics: ['Hooks'], focusKeywords: ['react'] } as any;
    const saved = { _id: 'sess1', ...dto } as any;
    mockRepo.create.mockResolvedValue(saved);
    const result = await service.create('host1', dto);
    expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, hostId: 'host1' });
    expect(result).toEqual(saved);
  });
});


