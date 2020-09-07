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

    async saveGroup(groupParams: Partial<Group>): Promise<Group> {
        const group = await this.groupModelDB.create(groupParams);

        return group.toJSON() as Group;
    }
}
