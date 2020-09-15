import express from 'express';

import { UserGroupsService } from 'app/services/user-groups.service';
import { AddUsersToGroupRequest } from 'app/schemas/user-groups.schema';

export async function addUsersToGroup(req: AddUsersToGroupRequest, res: express.Response): Promise<void> {
    const { groupId, userIds } = req.body;

    const result = await UserGroupsService.addUsersToGroup(groupId, userIds);

    if (result.isSuccess) {
        res.json(result.getValue());
    } else {
        res.status(404).json(result.getError());
    }
}
