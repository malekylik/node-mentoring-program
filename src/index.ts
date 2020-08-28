import express from 'express';

import { CreateUpdateUserValidation } from './schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModal } from './loaders/user-modal.loader';
import { UserModel } from './models/user.model';
import { UserService } from './services/user.service';
import { getUsers, createUser, getUserById, updateUser, deleteUser, getAutoSuggestUsers } from './controllers/user.controller';

const app: express.Application = express();

const router: express.Router = express.Router();

app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModalDB = loadUserModal(sequelize);
    UserService.setUserModel(new UserModel(userModalDB));

    router.route('/users')
        .get(getUsers)
        .post(CreateUpdateUserValidation, createUser);

    router.route('/users/:id')
        .get(getUserById)
        .put(CreateUpdateUserValidation, updateUser)
        .delete(deleteUser);

    router.route('/suggest')
        .get(getAutoSuggestUsers);

    app.use('/api/v1', router);

    app.listen(8080, () => {
        console.log('Server is running on port: 8080');
    });
}

process.on('unhandledRejection', (e) => {
    console.log('error occured: ', e);
});

void startApp();
