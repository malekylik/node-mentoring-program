import { Result } from 'type-result'

import { GroupService } from './group.service';
import { SequelizeService } from './sequelize.service';
import { Group } from 'app/types';
import { SequelizeError, createError, Error } from 'app/error/index';

class UserGroupsService {
    async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<Result<Group, Error<Array<string>>>> {
        try {
            const group = await SequelizeService.transaction(async (t) => {
                const group = await GroupService.setUsers(groupId, userIds, { transaction: t });
    
                return Result.ok(group);
            });

            return group;
        } catch (e) {
            if (e.name === SequelizeError.UniqueConstraint) {
                const errors: Array<string> = e.errors
                    .filter((e: { path: string }) => e.path === 'userId')
                    .map((e: { value: string }) => e.value);

                return Result.fail(createError('Users are already in group', errors));
            }

            return Result.fail(createError('some err occured', null));
        }

    }
}

const userGroupsService = new UserGroupsService();

export { userGroupsService as UserGroupsService };
