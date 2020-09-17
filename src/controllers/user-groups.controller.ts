import express from 'express';

import { UserGroupsService } from 'app/services/user-groups.service';
import { AddUsersToGroupRequest } from 'app/schemas/user-groups.schema';

export async function addUsersToGroup(req: AddUsersToGroupRequest, res: express.Response): Promise<void> {
    const { groupId, userIds } = req.body;

    const result = await UserGroupsService.addUsersToGroup(groupId, userIds.map(id => String(id)));

    if (result.isSuccess) {
        const value = result.getValue()

        if (value !== null) {
            res.json(value);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(400).json(result.getError());
    }
}
