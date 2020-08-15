import express from 'express';

type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
};

const app: express.Application = express();

app.get('/:id', (req, res) => {
    res.json(req.params);
});

app.listen(8080, () => {
    console.log('Server started on port: 8080');
});
