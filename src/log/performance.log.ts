import express from 'express';

import { logger } from './logger';

export function performanceLogDecorator<G>(
    controller: (req: express.Request, res: express.Response, next?: express.NextFunction) => G | Promise<G>,
    contorllerName: string = controller.name
): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
    return function decoratorController(req: express.Request, res: express.Response, next: express.NextFunction) {
        const now = Date.now();

        logger.info(`start - ${contorllerName}`);

        const result = controller(req, res, next);

        if (result && (result as Promise<G>).then) {
            void (result as Promise<G>).then(() => logger.info(`end - ${contorllerName} - ${Date.now() - now}ms`))
        } else {
            logger.info(`end - ${contorllerName} - ${Date.now() - now}ms`);
        }
    }
}
