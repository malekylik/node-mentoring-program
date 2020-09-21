import { Sequelize, DataTypes, ModelCtor, Model } from 'sequelize';

import { UserInstance, GroupInstance } from 'app/models/types';

export async function loadUserGroupsModel(sequelize: Sequelize, userModelDB: ModelCtor<UserInstance>, groupModelDB: ModelCtor<GroupInstance>): Promise<ModelCtor<Model>> {
    const UserGroups = sequelize.define('UserGroups', {
        UserId: {
          type: DataTypes.INTEGER,
          references: {
            model: userModelDB,
            key: 'id'
          }
        },
        GroupId: {
          type: DataTypes.INTEGER,
          references: {
            model: groupModelDB,
            key: 'id'
          }
        }
    }, { timestamps: false });

    await UserGroups.sync();

    return UserGroups;
}
