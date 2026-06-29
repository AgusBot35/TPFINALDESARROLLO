import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { UsersService } from '../services/users.service';

import { UserRoleDto } from '../dto/user-role.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRol } from 'src/auth/types/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  async getUserRole(@Param('id') id: string, @Body() rol: UserRoleDto ): Promise<{id: string, email: string, role: UserRol, createdAt: Date}> {
    return this.usersService.changeRole(id, rol.role);
  }
}
