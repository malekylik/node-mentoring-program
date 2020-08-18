import express from 'express';
import { v4 as uuidv4 } from 'uuid';

type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};

const savedUsers: Array<User> = [];

const app: express.Application = express();

const router: express.Router = express.Router();

const getUsers = () => savedUsers.filter(user => !user.isDeleted);
const getUserById = (id: string) => getUsers().find(user => user.id === id);
const pushUser = (user: User) => savedUsers.push(user);

app.use(express.json());

router.route('/users')
    .post((req, res) => {
        const { login, password, age }: { login: string, password: string, age: string }
            = (req.body as { login: string, password: string, age: string });

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
    .get((req, res) => {
        const { id }: { id: string } = (req.params as { id: string });

        const user = getUserById(id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .put((req, res) => {
        const { id }: { id: string } = (req.params as { id: string });
        const { login, password, age }: { login: string, password: string, age: string }
            = (req.body as { login: string, password: string, age: string });

        const user = getUserById(id);

        if (user) {
            if (login !== undefined) {
                user.login = login;
            }

            if (password !== undefined) {
                user.password = password;
            }

            if (age !== undefined) {
                user.age = Number(age);
            }

            res.json(user);
        } else {
            res.status(404).end();
        }
    })
    .delete((req, res) => {
        const { id }: { id: string } = (req.params as { id: string });

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
        const { login_substring: loginSubstring, limit }:
            { login_substring: string, limit: string } = (req.query as { login_substring: string, limit: string });

        const suggest = getAutoSuggestUsers(loginSubstring, Number(limit));

        res.json(suggest);
    });

app.use('/api/v1', router);

app.listen(8080, () => {
    console.log('Server is running on port: 8080');
});
