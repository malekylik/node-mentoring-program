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

app.use(express.json());

router.route('/users')
    .post((res, req) => {
        const { login, password, age }: { login: string, password: string, age: string }
            = (res.body as { login: string, password: string, age: string });

        const user: User = {
            login,
            password,
            id: uuidv4(),
            age: Number(age),
            isDeleted: false,
        };

        savedUsers.push(user);

        req.status(201).json(user);
    });

router.route('/users/:id')
    .get((req, res) => {
        const { id }: { id: string } = (req.params as { id: string });

        const user = savedUsers.find(user => user.id === id && !user.isDeleted);

        if (user) {
            res.json(user);
        } else {
            res.status(404).end();
        }
    });

app.use('/api/v1', router);

app.listen(8080, () => {
    console.log('Server is running on port: 8080');
});
