import { DeepPartial, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm/dist/common/typeorm.decorators";

export class TypeORMUsersRepository implements UsersRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>
    ) {}

    findAll(): Promise<UserEntity[]> {
        return this.usersRepo.find();
    }
    findById(id: string): Promise<UserEntity | null> {
        return this.usersRepo.findOneBy({id});
    }
    create(input: DeepPartial<UserEntity>): Promise<UserEntity> {
        const user = this.usersRepo.create(input);
        return this.usersRepo.save(user);
    }
    update(user: UserEntity, input: DeepPartial<UserEntity>): Promise<UserEntity> {
        this.usersRepo.merge(user, input);
        return this.usersRepo.save(user);
    }
    delete(user: UserEntity): Promise<UserEntity> {
        return this.usersRepo.remove(user);
    }
    
}