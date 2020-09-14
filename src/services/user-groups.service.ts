import { Result } from 'type-result'

import { GroupService } from './group.service';
import { SequelizeService } from './sequelize.service';
import { Group } from 'app/types';

class UserGroupsService {
    async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<Result<Group, Array<{ message: string, value: string }>>> {
        try {
            const group = await SequelizeService.transaction(async (t) => {
                const group = await GroupService.setUsers(groupId, userIds, { transaction: t });
    
                return Result.ok(group);
            });

            return group;
        } catch (e) {
            const errors = e?.errors?.filter((e: { path: string }) => e.path === 'userId');

            console.log('add users', e);

            return Result.fail(errors || { message: 'some err occured' });
        }

    }
}

const userGroupsService = new UserGroupsService();

export { userGroupsService as UserGroupsService };
