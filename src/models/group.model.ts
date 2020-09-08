import { ModelCtor } from 'sequelize';

import { GroupInstance } from './types';
import { Group } from 'app/types';

export class GroupModel {
    private groupModelDB: ModelCtor<GroupInstance>;

    constructor (groupModelDB: ModelCtor<GroupInstance>) {
        this.groupModelDB = groupModelDB;
    }

    async getGroups(): Promise<Array<Group>> {
        const groups = await this.groupModelDB.findAll();

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

    private async getGroupModelById(id: string | number): Promise<GroupInstance | undefined> {
        const group = await this.groupModelDB.findOne({ where: { id } });

        return group;
    }
}
