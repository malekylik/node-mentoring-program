import jwt from 'jsonwebtoken';
import express from 'express';

import { config } from 'app/config/index';
import { LoginRequest } from 'app/schemas/login.schema';

const ONE_HOUR = 60 * 60;

export function login(req: LoginRequest, res: express.Response): void {
    const { name } = req.body;

    const payload = { name: name, isActive: true };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: ONE_HOUR });

    res.status(200).json(token);
}

const verify = (token: string, secretOrPublicKey: string, callback?: jwt.VerifyCallback): Promise<Record<string, unknown>> => {
    return new Promise((res, rej) => {
        jwt.verify(token, secretOrPublicKey, function (err: jwt.VerifyErrors, decode: Record<string, unknown>) {
            if (err) {
                rej(err);
            } else {
                res(decode);
            }
        });
    })
};

export async function checkToken(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const token = req.headers['x-access-token'] as string;

    if (token) {
        try {
            await verify(token, config.jwtSecret);

            next();
        } catch (e) {
            const err: jwt.VerifyErrors = e;

            next({ methodName: 'checkToken', error: `Invalid jwt token: ${err.message}`, code: 403 });
        }
    } else {
        res.status(401).end();
    }
}
