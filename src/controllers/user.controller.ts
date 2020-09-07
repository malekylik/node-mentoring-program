import express from 'express';

import { UserService } from 'app/services/user.service';
import { UserCreateRequest, UserUpdateRequest } from 'app/schema';
import { User } from 'app/types';

export async function getUsers(req: express.Request, res: express.Response): Promise<void> {
    const users = await UserService.getUsers();

    res.json(users);
}

export async function createUser(req: UserCreateRequest, res: express.Response): Promise<void> {
    const { login, password, age } = req.body;

    const user: User = await UserService.saveUser({ login, password, age: Number(age) });

    res.status(201).json(user);
}

export async function getUserById(req: UserUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;
    const user: User = await UserService.getUserById(id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).end();
    }
}

export async function updateUser(req: UserUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;
    const { login, password, age } = req.body;

    const user = await UserService.updateUser(id, { login, password, age: Number(age) });

    if (user) {
        res.json(user);
    } else {
        res.status(404).end();
    }
}

export async function deleteUser(req: UserUpdateRequest, res: express.Response): Promise<void> {
    const { id } = req.params;

    const isDeleted = await UserService.deleteUser(id);

    if (isDeleted) {
        res.status(202).end();
    } else {
        res.status(404).end();
    }
}

export async function getAutoSuggestUsers(req: express.Request, res: express.Response): Promise<void> {
    const { login_substring: loginSubstring = '', limit = '15' }:
        { login_substring: string, limit: string } = (req.query as { login_substring: string, limit: string });

    const suggest = await UserService.getAutoSuggestUsers(loginSubstring, Number(limit));

    res.json(suggest);
}
