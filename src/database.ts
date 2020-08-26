import { Sequelize, DataTypes, Model, Op } from 'sequelize';

import { User } from './types';

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('nodementoring', 'postgres', '308029', {
    host: 'localhost',
    dialect: 'postgres'
  });

sequelize.authenticate()
    .then(() => console.log('connection ok'))
    .catch(() => console.log('connection fail'));

//do something when app is closing
process.on('exit', () => { void sequelize.close(); });

//catches ctrl+c event
process.on('SIGINT', () => { void sequelize.close(); });

process.on('unhandledRejection', () => { void sequelize.close(); });

interface UserInstance extends User, Model {
}

export const UserModel = sequelize.define<UserInstance>('user', {
    id: {
        type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true
    },
    login: {
      type: DataTypes.STRING, allowNull: false
    },
    password: {
        type: DataTypes.STRING, allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
    }
}, { timestamps: false });

export const getUsers = async (): Promise<Array<User>> => (await UserModel.findAll()).map(user => user.toJSON() as User);

export const getUserByIdModel = async (id: string): Promise<UserInstance | undefined> => {
    return await UserModel.findOne({ where: { id } });
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    const user = await getUserByIdModel(id);

    if (!user) {
        return null;
    }

    return user.toJSON() as User;
}

export const pushUser = async (userParams: Partial<User>): Promise<User> => {
    const user = (await UserModel.create(userParams)).toJSON() as User;

    return user;
};

export const updateUser = async (id: string, userParams: Partial<User>): Promise<User | null> => {
    const user = await getUserByIdModel(id);

    if (!user) {
        return null;
    }

    user.login = userParams.login;
    user.password = userParams.password;
    user.age = Number(userParams.age);

    await user.save();

    return user.toJSON() as User;
};

export const deleteUser = async (id: string): Promise<boolean> => {
    const user = await getUserByIdModel(id);

    if (!user) {
        return false;
    }

    await user.destroy();

    return true;
};

export async function getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Array<User>> {
    const suggest = (await UserModel.findAll({
        limit: Number(limit), order: [['login', 'ASC']],
        where: {
            login: {
                [Op.like]: '%' + loginSubstring + '%'
            }
        }
    })).map(user => user.toJSON() as User);

    return suggest;
}
