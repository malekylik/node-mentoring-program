import { User } from './types';

const savedUsers: Array<User> = [];

export const getUsers = (): Promise<Array<User>> => Promise.resolve(savedUsers.filter(user => !user.isDeleted));

export const getUserById = async (id: string): Promise<User | undefined> => {
    const users = await getUsers();
    const user = users.find(user => user.id === id);

    return user;
}

export const pushUser = (user: User): Promise<number> => Promise.resolve(savedUsers.push(user));
