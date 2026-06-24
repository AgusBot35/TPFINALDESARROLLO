import { Global, Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';

@Global()
@Module({
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
