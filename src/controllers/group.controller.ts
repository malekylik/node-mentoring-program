import express from 'express';

import { GroupService } from 'app/services/group.service';
import { GroupCreateRequest, GroupUpdateRequest } from 'app/schemas/group.schema';
import { Group } from 'app/types';

export async function getGroups(req: express.Request, res: express.Response): Promise<void> {
    const groups = await GroupService.getGroups();

    res.json(groups);
}

export async function createGroup(req: GroupCreateRequest, res: express.Response): Promise<void> {
    const { name, permissions } = req.body;

    const group = await GroupService.saveGroup({ name, permissions });

    res.json(group);
}

export async function getGroupById(req: GroupUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;
    const group: Group = await GroupService.getGroupById(id);

    if (group) {
        res.json(group);
    } else {
        res.status(404).end();
    }
}

export async function updateGroup(req: GroupUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const group = await GroupService.updateGroup(id, { name, permissions });

    if (group) {
        res.json(group);
    } else {
        res.status(404).end();
    }
}

export async function deleteGroup(req: GroupUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;

    const isDeleted = await GroupService.deleteGroup(id);

    if (isDeleted) {
        res.status(202).end();
    } else {
        res.status(404).end();
    }
}
