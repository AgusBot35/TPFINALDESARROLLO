import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_GATEWAY,
      useFactory: () => {
        return process.env.USERS_SOURCE === 'local'
          ? new LocalUsersGateway()
          : new JsonPlaceholderUsersGateway()
      }
    },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}
