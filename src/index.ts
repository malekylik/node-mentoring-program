import express from 'express';

import { User } from './types';
import { getUserById, pushUser, getUsers, getAutoSuggestUsers, updateUser, deleteUser } from './database';
import { CreateUpdateUserValidation, UserCreateRequest, UserUpdateRequest } from './schema';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

router.route('/users')
    .get(async (req, res) => {
        const users = await getUsers();

        res.json(users);
    })
    .post(CreateUpdateUserValidation, async (req: UserCreateRequest, res) => {
        const { login, password, age } = req.body;

        const user: User = await pushUser({ login, password, age: Number(age) });

        res.status(201).json(user);
    });

router.route('/users/:id')
    .get(async (req: UserUpdateRequest, res) => {
        const { id } = req.params;
        const user: User = await getUserById(id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .put(CreateUpdateUserValidation, async (req: UserUpdateRequest, res) => {
        const { id } = req.params;
        const { login, password, age } = req.body;

        const user = await updateUser(id, { login, password, age: Number(age) });

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .delete(async (req: UserUpdateRequest, res) => {
        const { id } = req.params;

        const isDeleted = await deleteUser(id);

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

        const suggest = await getAutoSuggestUsers(loginSubstring, Number(limit));

        res.json(suggest);
    });

app.use('/api/v1', router);

app.listen(8080, () => {
    console.log('Server is running on port: 8080');
});

process.on('unhandledRejection', (e) => {
    console.log('error occured: ', e);
});
