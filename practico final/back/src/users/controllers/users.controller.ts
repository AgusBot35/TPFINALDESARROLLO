import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';

import { UsersService } from '../services/users.service';

import { UserRoleDto } from '../dto/user-role.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRol } from 'src/auth/types/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { DeleteAccountDto } from '../dto/delete-account.dto';

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

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() request: any, @Body() dto: ChangePasswordDto,): Promise<{ message: string }> {
    await this.usersService.changePassword(request.user.sub, dto);
    return { message: 'Contraseña actualizada correctamente' };
  }

  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  async changeEmail(@Request() request: any, @Body() dto: ChangeEmailDto): Promise<{ message: string }> {
    await this.usersService.changeEmail(request.user.sub, dto);
    return { message: 'Email updated' };
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@Request() request: any, @Body() dto: DeleteAccountDto){
    return await this.usersService.deleteAccount(request.user.sub, dto);
  }
}
