import express from 'express';

import { v4 as uuidv4 } from 'uuid';

import { User } from './types';
import { getUserById, pushUser, getUsers } from './database';
import { CreateUpdateUserValidation, UserCreateRequest, UserUpdateRequest } from './schema';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

router.route('/users')
    .get((req, res) => {
        res.json(getUsers());
    })
    .post(CreateUpdateUserValidation, (req: UserCreateRequest, res) => {
        const { login, password, age } = req.body;

        const user: User = {
            login,
            password,
            id: uuidv4(),
            age: Number(age),
            isDeleted: false,
        };

        pushUser(user);

        res.status(201).json(user);
    });

router.route('/users/:id')
    .get((req: UserUpdateRequest, res) => {
        const { id } = req.params;

        const user = getUserById(id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .put(CreateUpdateUserValidation, (req: UserUpdateRequest, res) => {
        const { id } = req.params;
        const { login, password, age } = req.body;

        const user = getUserById(id);

        if (user) {
            user.login = login;
            user.password = password;
            user.age = Number(age);

            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .delete((req: UserUpdateRequest, res) => {
        const { id } = req.params;

        const user = getUserById(id);

        if (user) {
            user.isDeleted = true;

            res.status(202).end();
        } else {
            res.status(404).end();
        }
    });


function getAutoSuggestUsers(loginSubstring: string, limit: number): Array<User> {
    const suggestedUsers: Array<User> = [];

    const sorted = getUsers().sort((user1, user2) => user2.login < user1.login ? 1 : -1);

    for (let i = 0; i < sorted.length && suggestedUsers.length < limit; i++) {
        const user = sorted[i];

        if (new RegExp(loginSubstring).test(user.login)) {
            suggestedUsers.push(user);
        }
    }

    return suggestedUsers;
}

router.route('/suggest')
    .get((req, res) => {
        const { login_substring: loginSubstring = '', limit = '15' }:
            { login_substring: string, limit: string } = (req.query as { login_substring: string, limit: string });

        const suggest = getAutoSuggestUsers(loginSubstring, Number(limit));

        res.json(suggest);
    });

app.use('/api/v1', router);

app.listen(8080, () => {
    console.log('Server is running on port: 8080');
});
