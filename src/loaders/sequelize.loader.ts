import { Sequelize } from 'sequelize';

import { config } from 'app/config/index';
import { logger } from 'app/log/logger';

export async function loadSequelize(): Promise<Sequelize> {
    const sequelize = new Sequelize('nodementoring', config.dbUser, config.dbPass, {
        host: config.dbHost,
        dialect: 'postgres'
    });

    try {
        await sequelize.authenticate();
        logger.info('sequelize connection is ok');
    } catch (e) {
        logger.error(`sequelize connection fail: ${JSON.stringify(e)}`);
    }

    //do something when app is closing
    process.on('exit', () => { void sequelize.close(); });
    //catches ctrl+c event
    process.on('SIGINT', () => { void sequelize.close(); });

    process.on('unhandledRejection', () => { void sequelize.close(); });

    return sequelize;
}
