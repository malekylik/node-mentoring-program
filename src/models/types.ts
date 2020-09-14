import { Model, BelongsToManyGetAssociationsMixin, BelongsToManyAddAssociationsMixin } from 'sequelize';

import { User, Group } from 'app/types';

export interface UserInstance extends User, Model {
}

export interface GroupInstance extends Group, Model {
    getUsers: BelongsToManyGetAssociationsMixin<UserInstance>;
    addUsers: BelongsToManyAddAssociationsMixin<UserInstance, string>;
}
