import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUsersRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    search: jest.fn(),
    getFirst10Users: jest.fn(),
    getUserSessionStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName:"Jhon",
        lastName:"Doe",
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedUser = {
        _id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar-url',
        status: 'online',
      };

      mockUsersRepository.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [
          { _id: 'user1', name: 'User 1', email: 'user1@example.com' },
          { _id: 'user2', name: 'User 2', email: 'user2@example.com' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll(paginationDto);

      expect(repository.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 'user-id';
      const expectedUser = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockUsersRepository.findById.mockResolvedValue(expectedUser);

      const result = await service.findById(userId);

      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id';

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john@example.com';
      const expectedUser = {
        _id: 'user-id',
        name: 'John Doe',
        email,
      };

      mockUsersRepository.findByEmail.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(repository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found by email', async () => {
      const email = 'nonexistent@example.com';

      mockUsersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(repository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'user-id';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        location: 'New York',
      };

      const expectedUser = {
        _id: userId,
        name: 'Updated Name',
        email: 'john@example.com',
        location: 'New York',
      };

      mockUsersRepository.update.mockResolvedValue(expectedUser);

      const result = await service.update(userId, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException when user not found for update', async () => {
      const userId = 'non-existent-id';
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      mockUsersRepository.update.mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('search', () => {
    it('should search users with pagination', async () => {
      const query = 'john';
      const paginationDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [
          { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersRepository.search.mockResolvedValue(expectedResult);

      const result = await service.search(query, paginationDto);

      expect(repository.search).toHaveBeenCalledWith(query, paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getFirst10Users', () => {
    it('should return first 10 users', async () => {
      const expectedUsers = [
        { _id: 'user1', name: 'User 1', email: 'user1@example.com' },
        { _id: 'user2', name: 'User 2', email: 'user2@example.com' },
      ];

      mockUsersRepository.getFirst10Users.mockResolvedValue(expectedUsers);

      const result = await service.getFirst10Users();

      expect(repository.getFirst10Users).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 'user-id';
      const mockUser = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar-url',
        status: 'online',
        location: 'New York',
        bio: 'Test bio',
        createdAt: new Date(),
      };

      const mockSessionStats = {
        totalSessions: 10,
        completedSessions: 8,
        hostedSessions: 5,
        participatedSessions: 3,
      };

      mockUsersRepository.findById.mockResolvedValue(mockUser);
      mockUsersRepository.getUserSessionStats.mockResolvedValue(mockSessionStats);

      const result = await service.getUserStats(userId);

      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.getUserSessionStats).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('stats');
      expect(result.user).toEqual({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
        status: mockUser.status,
        location: mockUser.location,
        bio: mockUser.bio,
        createdAt: mockUser.createdAt,
      });
      expect(result.stats).toHaveProperty('rating');
      expect(result.stats.totalSessions).toBe(mockSessionStats.totalSessions);
      expect(result.stats.completedSessions).toBe(mockSessionStats.completedSessions);
      expect(result.stats.hostedSessions).toBe(mockSessionStats.hostedSessions);
      expect(result.stats.participatedSessions).toBe(mockSessionStats.participatedSessions);
    });

    it('should throw NotFoundException when user not found for stats', async () => {
      const userId = 'non-existent-id';

      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.getUserStats(userId)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });
  });
}); 