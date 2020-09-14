import { Sequelize, Transaction } from 'sequelize';

class SequelizeService {
    private sequelize: Sequelize;

    setSequelize(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    async createTransaction(): Promise<Transaction> {
        return this.sequelize.transaction();
    }

    async transaction<T>(callback: (t: Transaction) => Promise<T>): Promise<T> {
        return this.sequelize.transaction(callback);
    }
}

const sequelizeService = new SequelizeService();

export { sequelizeService as SequelizeService };
