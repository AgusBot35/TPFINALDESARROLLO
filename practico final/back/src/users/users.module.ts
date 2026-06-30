import { forwardRef, Global, Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';
import { USERS_REPOSITORY } from './repositories/users.repository';
import { TypeORMUsersRepository } from './repositories/typeorm-Users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

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
    {
      provide: USERS_REPOSITORY,
      useClass: TypeORMUsersRepository,
    }
  ],
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    MailModule
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}
