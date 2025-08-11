import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './skills.repository';
import { SkillsHttpService } from './skills-http.service';
import { PythonApiService } from '../common/python-api.service';
import { getModelToken } from '@nestjs/mongoose';
import { Skill } from './schemas/skill.schema';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('SkillsService', () => {
  let service: SkillsService;
  const mockRepo = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };
  const mockHttp = { executeBackgroundProcess: jest.fn() };
  const mockPython = { searchKeywords: jest.fn() };
  const mockModel = { find: jest.fn().mockReturnThis(), exec: jest.fn() } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: SkillsRepository, useValue: mockRepo },
        { provide: SkillsHttpService, useValue: mockHttp },
        { provide: PythonApiService, useValue: mockPython },
        { provide: getModelToken(Skill.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a skill and triggers background process when agenda present', async () => {
    const userId = 'u1';
    const dto = { name: 'React', category: 'Programming', proficiency: 80, type: 'teaching', agenda: ['Hooks'] } as any;
    const saved = { _id: 's1', ...dto };
    mockRepo.create.mockResolvedValue(saved);

    const result = await service.create(userId, dto);

    expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, userId });
    expect(mockHttp.executeBackgroundProcess).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it('finds skills by user', async () => {
    const expected = { data: [], total: 0 } as any;
    mockRepo.findByUserId.mockResolvedValue(expected);
    await expect(service.findByUserId('u1', { page: 1, limit: 10 } as any)).resolves.toEqual(expected);
  });

  it('finds skill by id or throws', async () => {
    const skill = { _id: 's1' } as any;
    mockRepo.findById.mockResolvedValue(skill);
    await expect(service.findById('s1')).resolves.toBe(skill);
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
  });

  it('updates only owner skill', async () => {
    const ownerId = 'u1';
    const skill = { _id: 's1', userId: { _id: ownerId } } as any;
    mockRepo.findById.mockResolvedValue(skill);
    mockRepo.update.mockResolvedValue({ ...skill, name: 'Updated' });
    await expect(service.update(ownerId, 's1', { name: 'Updated' } as any)).resolves.toHaveProperty('name', 'Updated');

    // Non-owner
    mockRepo.findById.mockResolvedValue({ _id: 's1', userId: { _id: 'other' } } as any);
    await expect(service.update(ownerId, 's1', {} as any)).rejects.toThrow(ForbiddenException);
  });

  it('removes only owner skill', async () => {
    const ownerId = 'u1';
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.remove(ownerId, 'missing')).rejects.toThrow(NotFoundException);
    mockRepo.findById.mockResolvedValue({ _id: 's1', userId: { _id: 'other' } } as any);
    await expect(service.remove(ownerId, 's1')).rejects.toThrow(ForbiddenException);
    mockRepo.findById.mockResolvedValue({ _id: 's1', userId: { _id: ownerId } } as any);
    mockRepo.remove.mockResolvedValue(undefined);
    await expect(service.remove(ownerId, 's1')).resolves.toBeUndefined();
  });
});


