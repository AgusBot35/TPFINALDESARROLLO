import { NotFoundException } from '@nestjs/common';
import * as users from '../data/users.json';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';

export class LocalUsersGateway implements UsersGateway {
    async fetchAll(): Promise<ExternalUser[]> {
        return users;
    }

    async fetchOne(id: number): Promise<ExternalUser> {
        const user = users.find(u => u.id === id);
        if (!user) throw new NotFoundException(`Usuario con ID: ${id} no encontrado.`);
        return user;
    }
}