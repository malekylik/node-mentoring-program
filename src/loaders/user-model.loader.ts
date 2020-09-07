import { Sequelize, DataTypes, ModelCtor } from 'sequelize';

import { UserInstance } from 'app/models/types';

export function loadUserModel(sequelize: Sequelize): ModelCtor<UserInstance> {
    const UserModel = sequelize.define<UserInstance>('user', {
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

    return UserModel;
}
