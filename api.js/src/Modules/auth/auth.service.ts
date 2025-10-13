import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/schemas/user.schema';
import { CloudinaryService } from '../common/cloudinary.service';
import { StreamChatService } from '../../Infastructure/StreamChat/stream-chat.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly streamChatService: StreamChatService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // Convert to plain object and remove password
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('Login - User object:', { email: user.email, id: user._id });
    const payload = { email: user.email, sub: String(user._id) };
    console.log('Login - JWT Payload:', payload);
    const access_token = this.jwtService.sign(payload);
    const stream_chat_token = this.streamChatService.generateUserToken(String(user._id));
    return {
      access_token,
      user,
      stream_chat_token,
    };
  }

  async register(registerDto: RegisterDto, file?: Express.Multer.File) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    
    // Upload avatar to Cloudinary if file is provided
    let avatarUrl = ""; // Use provided URL if no file
    if (file) {
      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only image files are allowed.');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      try {
        avatarUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }
    }

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    // Create Stream Chat user
    try {
      await this.streamChatService.updateUser(String(user._id), {
        name: user.name,
        image: avatarUrl || undefined,
        email: user.email,
      });
    } catch (error) {
      // Log the error but don't fail the registration
      console.error('Failed to create Stream Chat user:', error);
    }

    const { password, ...result } = user;
    const payload = { email: user.email, sub: user._id };

    return  { 
      data: user._id
    }
  }
}