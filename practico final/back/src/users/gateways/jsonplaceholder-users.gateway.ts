import axios from 'axios';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';

export class JsonPlaceholderUsersGateway implements UsersGateway {
  async fetchAll(): Promise<ExternalUser[]> {
    const { data } = await axios.get<ExternalUser[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
    return data;
  }

  async fetchOne(id: number): Promise<ExternalUser> {
    const { data } = await axios.get<ExternalUser>(`https://jsonplaceholder.typicode.com/users/${id}`);
    return data;
  }
}

