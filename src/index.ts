import express from 'express';

import { v4 as uuidv4 } from 'uuid';

import { User } from './types';
import { getUserById, pushUser, getUsers } from './database';
import { CreateUpdateUserValidation, UserCreateRequest, UserUpdateRequest } from './schema';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

router.route('/users')
    .get(async (req, res) => {
        res.json(await getUsers());
    })
    .post(CreateUpdateUserValidation, async (req: UserCreateRequest, res) => {
        const { login, password, age } = req.body;

        const user: User = {
            login,
            password,
            id: uuidv4(),
            age: Number(age),
            isDeleted: false,
        };

        await pushUser(user);

        res.status(201).json(user);
    });

router.route('/users/:id')
    .get(async (req: UserUpdateRequest, res) => {
        const { id } = req.params;

        const user = await getUserById(id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .put(CreateUpdateUserValidation, async (req: UserUpdateRequest, res) => {
        const { id } = req.params;
        const { login, password, age } = req.body;

        const user = await getUserById(id);

        if (user) {
            user.login = login;
            user.password = password;
            user.age = Number(age);

            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .delete(async (req: UserUpdateRequest, res) => {
        const { id } = req.params;

        const user = await getUserById(id);

        if (user) {
            user.isDeleted = true;

            res.status(202).end();
        } else {
            res.status(404).end();
        }
    });


async function getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Array<User>> {
    const sorted = (await getUsers()).sort((user1, user2) => user2.login < user1.login ? 1 : -1);

    const suggestedUsers: Array<User> = [];

    for (let i = 0; i < sorted.length && suggestedUsers.length < limit; i++) {
        const user = sorted[i];

        if (new RegExp(loginSubstring).test(user.login)) {
            suggestedUsers.push(user);
        }
    }

    return suggestedUsers;
}

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
