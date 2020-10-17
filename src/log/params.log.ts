import express from 'express';

import { logger } from './logger';

export function logParams(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const { originalUrl,  params, query } = req;

    logger.info(`url - ${originalUrl}`);
    logger.info(`params - ${JSON.stringify(params)}`);
    logger.info(`query - ${JSON.stringify(query)}`);

    next();
}
