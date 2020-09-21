import { Sequelize, DataTypes, ModelCtor } from 'sequelize';

import { GroupInstance } from 'app/models/types';

export function loadGroupModel(sequelize: Sequelize): ModelCtor<GroupInstance> {
    const GroupModel = sequelize.define<GroupInstance>('group', {
        id: {
            type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, allowNull: false,
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    }, { timestamps: false });

    return GroupModel;
}
