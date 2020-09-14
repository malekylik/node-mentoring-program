import { ModelCtor, Model, Transaction } from 'sequelize';

import { GroupInstance } from './types';
import { Group } from 'app/types';

export class GroupModel {
    private groupModelDB: ModelCtor<GroupInstance>;
    private userModelDB: ModelCtor<Model>;

    constructor (groupModelDB: ModelCtor<GroupInstance>, userModelDB: ModelCtor<Model>) {
        this.groupModelDB = groupModelDB;
        this.userModelDB = userModelDB;
    }

    async getGroups(): Promise<Array<Group>> {
        const groups = await this.groupModelDB.findAll({
            include: {
                model: this.userModelDB,
                through: { attributes: [] }
            },
        });

        return groups.map(group => group.toJSON() as Group);
    }

    async getGroupById(id: string | number): Promise<Group | null> {
        const group = await this.getGroupModelById(id);

        if (!group) {
            return null;
        }

        return group.toJSON() as Group;
    }

    async saveGroup(groupParams: Partial<Group>): Promise<Group> {
        const group = await this.groupModelDB.create(groupParams);

        return group.toJSON() as Group;
    }

    async updateGroup(id: string | number, userParams: Partial<Group>): Promise<Group | null> {
        const group = await this.getGroupModelById(id);

        if (!group) {
            return null;
        }

        group.name = userParams.name;
        group.permissions = userParams.permissions;

        await group.save();

        return group.toJSON() as Group;
    }

    async deleteGroup(id: string): Promise<boolean> {
        const group = await this.getGroupModelById(id);

        if (!group) {
            return false;
        }

        await group.destroy();

        return true;
    }

    async setUsers(id: string, users: Array<string>, options?: { transaction: Transaction }): Promise<Group> {
        const group = await this.getGroupModelById(id, options);

        await group.addUsers(users, options);

        const groupJSON = group.toJSON() as Group;
        groupJSON.users = await group.getUsers({
            joinTableAttributes: [],
            ...options,
        });

        return groupJSON;
    }

    private async getGroupModelById(id: string | number, options?: { transaction: Transaction }): Promise<GroupInstance | undefined> {
        const group = await this.groupModelDB.findOne({
            where: { id },
            include: {
                model: this.userModelDB,
                through: { attributes: [] }
            },
            ...options,
        });

        return group;
    }
}
