import express from 'express';

import { CreateUpdateUserValidation } from './schemas/user.schema';
import { CreateUpdateGroupValidation } from './schemas/group.schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModel } from './loaders/user-model.loader';
import { loadGroupModel } from './loaders/group-model.loader';
import { UserModel } from './models/user.model';
import { GroupModel } from './models/group.model';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { getUsers, createUser, getUserById, updateUser, deleteUser, getAutoSuggestUsers } from './controllers/user.controller';
import { Group } from './types';
import { GroupCreateRequest, GroupUpdateRequest } from 'app/schemas/group.schema';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModelDB = loadUserModel(sequelize);
    const groupModelDB = loadGroupModel(sequelize);
    UserService.setUserModel(new UserModel(userModelDB));
    GroupService.setGroupModel(new GroupModel(groupModelDB))

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
            const groups = await GroupService.getGroups();

            res.json(groups);
        })
        .post(CreateUpdateGroupValidation, async (req: GroupCreateRequest, res) => {
            const { name, permissions } = req.body;

            const group = await GroupService.saveGroup({ name, permissions });

            res.json(group);
        });

    router.route('/groups/:id')
        .get(async (req, res) => {
            const { id } = req.params;
            const group: Group = await GroupService.getGroupById(id);

            if (group) {
                res.json(group);
            } else {
                res.status(404).end();
            }
        })
        .put(CreateUpdateGroupValidation, async (req: GroupUpdateRequest, res) => {
            const { id } = req.params;
            const { name, permissions } = req.body;

            const group = await GroupService.updateGroup(id, { name, permissions });

            if (group) {
                res.json(group);
            } else {
                res.status(404).end();
            }
        })
        .delete(async (req, res) => {
            const { id } = req.params;

            const isDeleted = await GroupService.deleteGroup(id);

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
