import { ModelCtor, Op } from 'sequelize';

import { UserInstance } from './types';
import { User } from 'app/types';

export class UserModel {
    private userModelDB: ModelCtor<UserInstance>;

    constructor (userModelDB: ModelCtor<UserInstance>) {
        this.userModelDB = userModelDB;
    }

    async getUsers(): Promise<Array<User>> {
        const users = await this.userModelDB.findAll();

        return users.map(user => user.toJSON() as User);
    }

    async getUserById(id: string | number): Promise<User | null> {
        const user = await this.getUserModelById(id);

        if (!user) {
            return null;
        }

        return user.toJSON() as User;
    }

    async saveUser(userParams: Partial<User>): Promise<User> {
        const user = await this.userModelDB.create(userParams);

        return user.toJSON() as User;
    }

    async updateUser(id: string | number, userParams: Partial<User>): Promise<User | null> {
        const user = await this.getUserModelById(id);

        if (!user) {
            return null;
        }

        user.login = userParams.login;
        user.password = userParams.password;
        user.age = Number(userParams.age);

        await user.save();

        return user.toJSON() as User;
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.getUserModelById(id);

        if (!user) {
            return false;
        }

        await user.destroy();

        return true;
    }

    async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Array<User>> {
        const suggest = await this.userModelDB.findAll({
            limit: Number(limit), order: [['login', 'ASC']],
            where: {
                login: {
                    [Op.like]: '%' + loginSubstring + '%'
                }
            }
        });

        return suggest.map(user => user.toJSON() as User);
    }

    private async getUserModelById(id: string | number): Promise<UserInstance | undefined> {
        const user = await this.userModelDB.findOne({ where: { id } });

        return user;
    }
}
