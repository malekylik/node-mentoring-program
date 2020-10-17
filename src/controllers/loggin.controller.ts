import express from 'express';
import jwt from 'jsonwebtoken';

import { LoginRequest } from 'app/schemas/login.schema';

export function login(req: LoginRequest, res: express.Response): void {
    const { name } = req.body;

    const payload = { name: name, isActive: true };
    const token = jwt.sign(payload, 'secret', { expiresIn: 10 });

    res.status(200).json(token);
}
