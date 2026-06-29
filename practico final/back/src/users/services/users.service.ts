import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';
import { USERS_REPOSITORY, UsersRepository } from '../repositories/users.repository';
import { UserEntity } from '../entities/user.entity';
import { UserRol } from 'src/auth/types/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll(){
      return await this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
    }
    return user;
  }

  async changeRole(id: string, rol: UserRol): Promise<{id: string, email: string, role: UserRol, createdAt: Date}> {
    const user = await this.findOne(id);
    user.role = rol;
    return {
      id: user.id, 
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}