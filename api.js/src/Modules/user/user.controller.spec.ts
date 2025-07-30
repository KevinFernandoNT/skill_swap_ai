import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let cloudinaryService: CloudinaryService;

  const mockUsersService = {
    findAll: jest.fn(),
    search: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    getUserStats: jest.fn(),
    getFirst10Users: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
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

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('search', () => {
    it('should search users with query and pagination', async () => {
      const query = 'john';
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [
          { _id: 'user1', name: 'John Doe', email: 'john@example.com' },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.search.mockResolvedValue(expectedResult);

      const result = await controller.search(query, paginationDto);

      expect(service.search).toHaveBeenCalledWith(query, paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return current user profile', async () => {
      const mockRequest = {
        user: { _id: 'current-user-id' },
      };
      const expectedUser = {
        _id: 'current-user-id',
        name: 'Current User',
        email: 'current@example.com',
      };

      mockUsersService.findById.mockResolvedValue(expectedUser);

      const result = await controller.getProfile(mockRequest);

      expect(service.findById).toHaveBeenCalledWith('current-user-id');
      expect(result).toEqual(expectedUser);
    });
  });

  describe('updateProfile', () => {
    it('should update current user profile without file', async () => {
      const mockRequest = {
        user: { _id: 'current-user-id' },
      };
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        location: 'New York',
      };
      const expectedUser = {
        _id: 'current-user-id',
        name: 'Updated Name',
        email: 'current@example.com',
        location: 'New York',
      };

      mockUsersService.update.mockResolvedValue(expectedUser);

      const result = await controller.updateProfile(mockRequest, updateUserDto);

      expect(service.update).toHaveBeenCalledWith('current-user-id', updateUserDto);
      expect(result).toEqual(expectedUser);
    });

    it('should update current user profile with file upload', async () => {
      const mockRequest = {
        user: { _id: 'current-user-id' },
      };
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024,
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;
      const mockAvatarUrl = 'https://cloudinary.com/avatar.jpg';
      const expectedUser = {
        _id: 'current-user-id',
        name: 'Updated Name',
        email: 'current@example.com',
        avatar: mockAvatarUrl,
      };

      mockCloudinaryService.uploadImage.mockResolvedValue(mockAvatarUrl);
      mockUsersService.update.mockResolvedValue(expectedUser);

      const result = await controller.updateProfile(mockRequest, updateUserDto, mockFile);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(service.update).toHaveBeenCalledWith('current-user-id', {
        ...updateUserDto,
        avatar: mockAvatarUrl,
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 'user-id';
      const expectedStats = {
        user: {
          _id: userId,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'avatar-url',
          status: 'online',
          location: 'New York',
          bio: 'Test bio',
          createdAt: new Date(),
        },
        stats: {
          rating: 4.5,
          totalSessions: 10,
          completedSessions: 8,
          hostedSessions: 5,
          participatedSessions: 3,
        },
      };

      mockUsersService.getUserStats.mockResolvedValue(expectedStats);

      const result = await controller.getUserStats(userId);

      expect(service.getUserStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedStats);
    });

    it('should throw NotFoundException when user not found for stats', async () => {
      const userId = 'non-existent-id';

      mockUsersService.getUserStats.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.getUserStats(userId)).rejects.toThrow(NotFoundException);
      expect(service.getUserStats).toHaveBeenCalledWith(userId);
    });
  });
}); 