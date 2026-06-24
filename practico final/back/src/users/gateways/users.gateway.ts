import { ExternalUser } from '../user.types';

export const USERS_GATEWAY = 'USERS_GATEWAY';

export interface UsersGateway {
  fetchAll(): Promise<ExternalUser[]>;
  fetchOne(id: number): Promise<ExternalUser>;
}

