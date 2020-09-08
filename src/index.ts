import express from 'express';

import { CreateUpdateUserValidation } from './schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModel } from './loaders/user-model.loader';
import { loadGroupModel } from './loaders/group-model.loader';
import { UserModel } from './models/user.model';
import { GroupModel } from './models/group.model';
import { UserService } from './services/user.service';
import { getUsers, createUser, getUserById, updateUser, deleteUser, getAutoSuggestUsers } from './controllers/user.controller';
import { Group } from './types';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModelDB = loadUserModel(sequelize);
    const groupModelDB = loadGroupModel(sequelize);
    UserService.setUserModel(new UserModel(userModelDB));

    const groupModel = new GroupModel(groupModelDB);

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
        .get(async (req, res) => {
            const groups = await groupModel.getGroups();

            res.json(groups);
        })
        .post(async (req, res) => {
            const { name, permissions } = req.body;

            const group = await groupModel.saveGroup({ name, permissions });

            res.json(group);
        });

    router.route('/groups/:id')
        .get(async (req, res) => {
            const { id } = req.params;
            const group: Group = await groupModel.getGroupById(id);

            if (group) {
                res.json(group);
            } else {
                res.status(404).end();
            }
        })
        .put(async (req, res) => {
            const { id } = req.params;
            const { name, permissions } = req.body;

            const group = await groupModel.updateGroup(id, { name, permissions });

            if (group) {
                res.json(group);
            } else {
                res.status(404).end();
            }
        })
        .delete(async (req, res) => {
            const { id } = req.params;

            const isDeleted = await groupModel.deleteGroup(id);

            if (isDeleted) {
                res.status(202).end();
            } else {
                res.status(404).end();
            }
        });

    app.use('/api/v1', router);

    app.listen(8080, () => {
        console.log('Server is running on port: 8080');
    });
}

process.on('unhandledRejection', (e) => {
    console.log('error occured: ', e);
});

void startApp();
