import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../repositories/users.repository';
import { UserEntity } from '../entities/user.entity';
import { UserRol } from 'src/auth/types/user-role.enum';
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { MailService } from 'src/mail/mail.service';
import { DeleteAccountDto } from '../dto/delete-account.dto';
@Injectable()
export class UsersService {
  constructor(
  @Inject(USERS_REPOSITORY)
  private readonly usersRepository: UsersRepository,
  private readonly configService: ConfigService,
  private readonly mailService: MailService
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

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findByIdWithPassword(userId);

    if(!user || !await bcrypt.compare(dto.currentPassword, user.passwordHash)){
      throw new UnauthorizedException('Las credenciales son invalidas');
    }

    const cost = Number(this.configService.getOrThrow<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(dto.newPassword, cost);
    await this.usersRepository.save(user);
  }

  async changeEmail(userId: string, dto:ChangeEmailDto): Promise<void> {
    const user = await this.usersRepository.findByIdWithPassword(userId);

    if(!user || !await bcrypt.compare(dto.password, user.passwordHash)){
      throw new UnauthorizedException('Las credenciales son invalidas');
    }

    user.email = dto.newEmail;
    const token = crypto.randomUUID()
    user.isVerified = false
    user.verificationToken = token
    
    const updatedUser = await this.usersRepository.save(user);

    this.mailService.sendVerificationEmail(user.email, user.verificationToken)
  }

  async deleteAccount(id: string, dto: DeleteAccountDto): Promise<{message: string}> {
    const user = await this.usersRepository.findByIdWithPassword(id);

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    await this.usersRepository.delete(user);
    
    return { message: "Account deleted" };
  }
}