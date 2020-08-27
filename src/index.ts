import express from 'express';

import { User } from './types';
import { CreateUpdateUserValidation, UserCreateRequest, UserUpdateRequest } from './schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModal } from './loaders/user-modal.loader';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModalDB = loadUserModal(sequelize);
    const userService = new UserService(new UserModel(userModalDB));

    router.route('/users')
        .get(async (req, res) => {
            const users = await userService.getUsers();

            res.json(users);
        })
        .post(CreateUpdateUserValidation, async (req: UserCreateRequest, res) => {
            const { login, password, age } = req.body;

            const user: User = await userService.saveUser({ login, password, age: Number(age) });

            res.status(201).json(user);
        });

    router.route('/users/:id')
        .get(async (req: UserUpdateRequest, res) => {
            const { id } = req.params;
            const user: User = await userService.getUserById(id);

            if (user) {
                res.json(user);
            } else {
                res.status(404).end();
            }
        })
        .put(CreateUpdateUserValidation, async (req: UserUpdateRequest, res) => {
            const { id } = req.params;
            const { login, password, age } = req.body;

            const user = await userService.updateUser(id, { login, password, age: Number(age) });

            if (user) {
                res.json(user);
            } else {
                res.status(404).end();
            }
        })
        .delete(async (req: UserUpdateRequest, res) => {
            const { id } = req.params;

            const isDeleted = await userService.deleteUser(id);

            if (isDeleted) {
                res.status(202).end();
            } else {
                res.status(404).end();
            }
        });

    router.route('/suggest')
        .get(async (req, res) => {
            const { login_substring: loginSubstring = '', limit = '15' }:
                { login_substring: string, limit: string } = (req.query as { login_substring: string, limit: string });

            const suggest = await userService.getAutoSuggestUsers(loginSubstring, Number(limit));

            res.json(suggest);
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
