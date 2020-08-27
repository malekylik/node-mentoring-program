import { Sequelize } from 'sequelize';

export async function loadSequelize(): Promise<Sequelize> {
    const sequelize = new Sequelize('nodementoring', 'postgres', '308029', {
        host: 'localhost',
        dialect: 'postgres'
    });

    try {
        await sequelize.authenticate();
        console.log('sequelize connection ok');
    } catch (e) {
        console.log('sequelize connection fail: ', e);
    }

    //do something when app is closing
    process.on('exit', () => { void sequelize.close(); });
    //catches ctrl+c event
    process.on('SIGINT', () => { void sequelize.close(); });

    process.on('unhandledRejection', () => { void sequelize.close(); });

    return sequelize;
}
