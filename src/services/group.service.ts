import { Group } from 'app/types';
import { GroupModel } from 'app/models/group.model';

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

    async saveGroup(userParams: Partial<Group>): Promise<Group> {
        return this.groupModel.saveGroup(userParams);
    }

    async updateGroup(id: string | number, userParams: Partial<Group>): Promise<Group | null> {
        return this.groupModel.updateGroup(id, userParams);
    }

    async deleteGroup(id: string): Promise<boolean> {
        return this.groupModel.deleteGroup(id);
    }
}

const groupService = new GroupService();

export { groupService as GroupService };
