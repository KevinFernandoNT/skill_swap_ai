import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import configuration from '../../../config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? "default_secret_key",
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Payload:', payload);
    console.log('JWT Strategy - User ID from payload.sub:', payload.sub);
    console.log('JWT Strategy - User ID type:', typeof payload.sub);
    
    try {
      // Convert string ID to ObjectId if needed
      const userId = payload.sub;
      console.log('JWT Strategy - Looking for user with ID:', userId);
      
      const user = await this.usersService.findById(userId);
      console.log('JWT Strategy - User found:', !!user);
      console.log('JWT Strategy - User data:', user ? { id: user._id, name: user.name, email: user.email } : 'null');
      
      if (!user) {
        console.log('JWT Strategy - User not found, checking database...');
        // Let's check if there are any users in the database
        const mongoose = require('mongoose');
        const User = mongoose.model('User');
        const totalUsers = await User.countDocuments();
        console.log('JWT Strategy - Total users in database:', totalUsers);
        
        const allUsers = await User.find({}, '_id name email').limit(5);
        console.log('JWT Strategy - Sample users in database:', allUsers);
        
        throw new Error('User not found');
      }
      
      const { password, ...result } = user;
      console.log('JWT Strategy - Returning user result:', { id: result._id, name: result.name, email: result.email });
      return result;
    } catch (error) {
      console.log('JWT Strategy - Error finding user:', error.message);
      console.log('JWT Strategy - User not found in database');
      throw new Error('User not found');
    }
  }
}