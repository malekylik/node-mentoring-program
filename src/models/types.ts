import { Model } from 'sequelize';

import { User, Group } from 'app/types';

export interface UserInstance extends User, Model {
}

export interface GroupInstance extends Group, Model {
}
