import { User } from './types';

const savedUsers: Array<User> = [];

export const getUsers = (): Array<User> => savedUsers.filter(user => !user.isDeleted);
export const getUserById = (id: string): User | undefined => getUsers().find(user => user.id === id);
export const pushUser = (user: User): number => savedUsers.push(user);
