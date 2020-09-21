import { Transaction } from 'sequelize';

import { GroupModel } from 'app/models/group.model';
import { Group } from 'app/types';

class GroupService {
    private groupModel: GroupModel;

    constructor (groupModel?: GroupModel) {
        this.groupModel = groupModel;
    }

    setGroupModel(groupModel: GroupModel): void {
        this.groupModel = groupModel;
    }

    async getGroups(): Promise<Array<Group>> {
        return this.groupModel.getGroups();
    }

    async getGroupById(id: string | number): Promise<Group | null> {
        return this.groupModel.getGroupById(id);
    }

    async saveGroup(groupParams: Partial<Group>): Promise<Group> {
        return this.groupModel.saveGroup(groupParams);
    }

    async updateGroup(id: string | number, userParams: Partial<Group>): Promise<Group | null> {
        return this.groupModel.updateGroup(id, userParams);
    }

    async deleteGroup(id: string): Promise<boolean> {
        return this.groupModel.deleteGroup(id);
    }

    async setUsers(id: string, users: Array<string>, options?: { transaction: Transaction }) {
        return this.groupModel.setUsers(id, users, options);
    }
}

const groupService = new GroupService();

export { groupService as GroupService };
