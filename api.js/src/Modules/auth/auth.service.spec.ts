import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { StreamChatService } from '../../Infastructure/StreamChat/stream-chat.service';
import { RegisterDto } from './dto/register.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let cloudinaryService: CloudinaryService;
  let streamChatService: StreamChatService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: jest.fn(),
  };

  const mockStreamChatService = {
    generateUserToken: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: StreamChatService,
          useValue: mockStreamChatService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    streamChatService = module.get<StreamChatService>(StreamChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email,
        password: hashedPassword,
        avatar: 'avatar-url',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
      });
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('correctpassword', 12);
      
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email,
        password: hashedPassword,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token, user, and stream chat token', async () => {
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockAccessToken = 'mock-access-token';
      const mockStreamChatToken = 'mock-stream-chat-token';

      mockJwtService.sign.mockReturnValue(mockAccessToken);
      mockStreamChatService.generateUserToken.mockReturnValue(mockStreamChatToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
      expect(streamChatService.generateUserToken).toHaveBeenCalledWith(String(mockUser._id));
      expect(result).toEqual({
        access_token: mockAccessToken,
        user: mockUser,
        stream_chat_token: mockStreamChatToken,
      });
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      firstName:"Kevin",
      lastName:"Fernando",
      address:"Sri lanak",
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const mockCreatedUser = {
        _id: 'new-user-id',
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        avatar: '',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockCreatedUser);
      mockStreamChatService.updateUser.mockResolvedValue(undefined);

      const result = await service.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: expect.any(String), // hashed password
        avatar: '',
      });
      expect(streamChatService.updateUser).toHaveBeenCalledWith(
        String(mockCreatedUser._id),
        {
          name: mockCreatedUser.name,
          image: undefined,
          email: mockCreatedUser.email,
        }
      );
      expect(result).toEqual({ data: mockCreatedUser._id });
    });

    it('should throw ConflictException when user already exists', async () => {
      const existingUser = {
        _id: 'existing-user-id',
        name: 'Existing User',
        email: registerDto.email,
      };

      mockUsersService.findByEmail.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should handle file upload when file is provided', async () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;

      const mockAvatarUrl = 'https://cloudinary.com/avatar.jpg';
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const mockCreatedUser = {
        _id: 'new-user-id',
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        avatar: mockAvatarUrl,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockCloudinaryService.uploadImage.mockResolvedValue(mockAvatarUrl);
      mockUsersService.create.mockResolvedValue(mockCreatedUser);
      mockStreamChatService.updateUser.mockResolvedValue(undefined);

      const result = await service.register(registerDto, mockFile);

      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: expect.any(String),
        avatar: mockAvatarUrl,
      });
      expect(result).toEqual({ data: mockCreatedUser._id });
    });

    it('should throw error for invalid file type', async () => {
      const mockFile = {
        mimetype: 'text/plain',
        size: 1024,
      } as Express.Multer.File;

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.register(registerDto, mockFile)).rejects.toThrow(
        'Invalid file type. Only image files are allowed.'
      );
      expect(cloudinaryService.uploadImage).not.toHaveBeenCalled();
    });

    it('should throw error for file too large', async () => {
      const mockFile = {
        mimetype: 'image/jpeg',
        size: 10 * 1024 * 1024, // 10MB
      } as Express.Multer.File;

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.register(registerDto, mockFile)).rejects.toThrow(
        'File size too large. Maximum size is 5MB.'
      );
      expect(cloudinaryService.uploadImage).not.toHaveBeenCalled();
    });

    it('should handle StreamChat service errors gracefully', async () => {
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const mockCreatedUser = {
        _id: 'new-user-id',
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        avatar: '',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockCreatedUser);
      mockStreamChatService.updateUser.mockRejectedValue(new Error('StreamChat error'));

      // Should not throw error, just log it
      const result = await service.register(registerDto);

      expect(streamChatService.updateUser).toHaveBeenCalled();
      expect(result).toEqual({ data: mockCreatedUser._id });
    });
  });
}); 