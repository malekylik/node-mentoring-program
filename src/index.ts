import express from 'express';

import { CreateUpdateUserValidation } from './schemas/user.schema';
import { CreateUpdateGroupValidation } from './schemas/group.schema';
import { AddUsersToGroupValidation } from './schemas/user-groups.schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModel } from './loaders/user-model.loader';
import { loadGroupModel } from './loaders/group-model.loader';
import { loadUserGroupsModel } from './loaders/user-groups.loader';
import { UserModel } from './models/user.model';
import { GroupModel } from './models/group.model';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { SequelizeService } from './services/sequelize.service';
import { getUsers, createUser, getUserById, updateUser, deleteUser, getAutoSuggestUsers } from './controllers/user.controller';
import { getGroups, createGroup, getGroupById, updateGroup, deleteGroup } from './controllers/group.controller';
import { addUsersToGroup } from './controllers/user-groups.controller';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModelDB = loadUserModel(sequelize);
    const groupModelDB = loadGroupModel(sequelize);
    const userGroupsModelDB = await loadUserGroupsModel(sequelize, userModelDB, groupModelDB);

    userModelDB.belongsToMany(groupModelDB, { through: userGroupsModelDB });
    groupModelDB.belongsToMany(userModelDB, { through: userGroupsModelDB });

    UserService.setUserModel(new UserModel(userModelDB, groupModelDB));
    GroupService.setGroupModel(new GroupModel(groupModelDB, userModelDB));
    SequelizeService.setSequelize(sequelize);

    router.route('/users')
        .get(getUsers)
        .post(CreateUpdateUserValidation, createUser);

    router.route('/users/:id')
        .get(getUserById)
        .put(CreateUpdateUserValidation, updateUser)
        .delete(deleteUser);

    router.route('/suggest')
        .get(getAutoSuggestUsers);

    router.route('/groups')
        .get(getGroups)
        .post(CreateUpdateGroupValidation, createGroup);

    router.route('/groups/:id')
        .get(getGroupById)
        .put(CreateUpdateGroupValidation, updateGroup)
        .delete(deleteGroup);

    router.route('/user-groups')
        .put(AddUsersToGroupValidation, addUsersToGroup);

    app.use('/api/v1', router);

    app.listen(8080, () => {
        console.log('Server is running on port: 8080');
    });
}

process.on('unhandledRejection', (e) => {
    console.log('error occured: ', e);
});

void startApp();
