import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Request, UseGuards } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { ExternalUser } from '../user.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRol } from '../../auth/types/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  findAll(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }

  @Get('auth-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async findAllAuthUsers() {
    return this.usersRepo.find({
      order: { createdAt: 'ASC' }
    });
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRol.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() body: { role: UserRol },
    @Request() req: any
  ) {
    if (req.user.id === id) {
      throw new BadRequestException('No podés cambiar tu propio rol');
    }

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    user.role = body.role;
    return this.usersRepo.save(user);
  }

  @Delete('me')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async deleteMe(@Request() req: any, @Body() body: { password: string }) {
    const user = await this.usersRepo.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id: req.user.id })
      .getOne();

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Contraseña incorrecta');

    await this.usersRepo.remove(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }
}
