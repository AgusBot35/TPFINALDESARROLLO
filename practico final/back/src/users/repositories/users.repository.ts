import { DeepPartial } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  create(input: DeepPartial<UserEntity>): Promise<UserEntity>;
  update(user: UserEntity, input: DeepPartial<UserEntity>): Promise<UserEntity>;
  delete(user: UserEntity): Promise<UserEntity>;
  findByIdWithPassword(id: string): Promise<UserEntity | null>;
  save(user: DeepPartial<UserEntity>): Promise<UserEntity>;
}