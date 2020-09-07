import { Model } from 'sequelize';

import { User } from 'app/types';

export interface UserInstance extends User, Model {
}
