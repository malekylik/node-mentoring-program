import express from 'express';
import cors from 'cors'

import { CreateUpdateUserValidation } from './schemas/user.schema';
import { CreateUpdateGroupValidation } from './schemas/group.schema';
import { AddUsersToGroupValidation } from './schemas/user-groups.schema';
import { LoginValidation } from './schemas/login.schema';
import { loadSequelize } from './loaders/sequelize.loader';
import { loadUserModel } from './loaders/user-model.loader';
import { loadGroupModel } from './loaders/group-model.loader';
import { loadUserGroupsModel } from './loaders/user-groups.loader';
import { UserModel } from './models/user.model';
import { GroupModel } from './models/group.model';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';
import { SequelizeService } from './services/sequelize.service';
import { getUsers, createUser, getUserById, updateUser, deleteUser, getAutoSuggestUsers } from './controllers/user.controller';
import { getGroups, createGroup, getGroupById, updateGroup, deleteGroup } from './controllers/group.controller';
import { addUsersToGroup } from './controllers/user-groups.controller';
import { login, checkToken } from './controllers/login.controller';
import { logParams } from './log/params.log';
import { performanceLogDecorator } from './log/performance.log';
import { ErrorLogInfo } from './log/types';
import { logger } from './log/logger';

const app: express.Application = express();

const userRouter: express.Router = express.Router();
const loginRouter: express.Router = express.Router();
const groupRouter: express.Router = express.Router();
const suggestRoute: express.Router = express.Router();
const userGroupRoute: express.Router = express.Router();

const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));
app.use(express.json());

async function startApp() {
    const sequelize = await loadSequelize();
    const userModelDB = loadUserModel(sequelize);
    const groupModelDB = loadGroupModel(sequelize);
    const userGroupsModelDB = await loadUserGroupsModel(sequelize, userModelDB, groupModelDB);

    userModelDB.belongsToMany(groupModelDB, { through: userGroupsModelDB });
    groupModelDB.belongsToMany(userModelDB, { through: userGroupsModelDB });

    UserService.setUserModel(new UserModel(userModelDB, groupModelDB));
    GroupService.setGroupModel(new GroupModel(groupModelDB, userModelDB));
    SequelizeService.setSequelize(sequelize);

    loginRouter.use(logParams);

    loginRouter.route('/login')
        .post(LoginValidation, performanceLogDecorator(login));

    userRouter.use(logParams);
    userRouter.use(checkToken);

    userRouter.route('/users')
        .get(performanceLogDecorator(getUsers))
        .post(CreateUpdateUserValidation, performanceLogDecorator(createUser));

    userRouter.route('/users/:id')
        .get(performanceLogDecorator(getUserById))
        .put(CreateUpdateUserValidation, performanceLogDecorator(updateUser))
        .delete(performanceLogDecorator(deleteUser));

    suggestRoute.use(logParams);
    suggestRoute.use(checkToken);

    suggestRoute.route('/suggest')
        .get(performanceLogDecorator(getAutoSuggestUsers));

    groupRouter.use(logParams);
    groupRouter.use(checkToken);

    groupRouter.route('/groups')
        .get(performanceLogDecorator(getGroups))
        .post(CreateUpdateGroupValidation, logParams, checkToken, performanceLogDecorator(createGroup));

    groupRouter.route('/groups/:id')
        .get(performanceLogDecorator(getGroupById))
        .put(CreateUpdateGroupValidation, performanceLogDecorator(updateGroup))
        .delete(performanceLogDecorator(deleteGroup));

    userGroupRoute.use(logParams);
    userGroupRoute.use(checkToken);

    userGroupRoute.route('/user-groups')
        .put(AddUsersToGroupValidation, performanceLogDecorator(addUsersToGroup));

    app.use('/api/v1', loginRouter, userRouter, groupRouter, suggestRoute, userGroupRoute);

    app.use((err: ErrorLogInfo<Array<string>>, req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { originalUrl, params, query } = req;

        logger.error(`method name - ${err.methodName}`);
        logger.error(`url - ${originalUrl}`);
        logger.error(`params - ${JSON.stringify(params)}`);
        logger.error(`query - ${JSON.stringify(query)}`);
        logger.error(`handled error - ${JSON.stringify(err.error)}`);

        res.status(err.code ?? 500).json(err.error);
    });

    app.listen(8080, () => {
        logger.info('Server is running on port: 8080');
    });
}

process.on('unhandledRejection', (e) => {
    logger.info(`error occured in app: ${JSON.stringify(e)}`);
});

void startApp();
