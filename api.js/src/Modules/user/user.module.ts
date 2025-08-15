import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { CloudinaryService } from '../common/cloudinary.service';
import { ExchangeSession, ExchangeSessionSchema } from '../exchange-sessions/schemas/exchange-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: ExchangeSession.name, schema: ExchangeSessionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, CloudinaryService],
  exports: [UsersService, UsersRepository],
})
export class UserModule {}