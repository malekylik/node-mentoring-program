import Joi from '@hapi/joi';

import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation'

const validator = createValidator();

const querySchema = Joi.object({
    groupId: Joi.number().positive().required(),
    userIds: Joi.array().items(Joi.number().positive()).unique().required(),
});

interface AddUsersToGroup extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        groupId: string,
        userIds: Array<string>,
    }
}

export const AddUsersToGroupValidation = validator.body(querySchema);
export type AddUsersToGroupRequest = ValidatedRequest<AddUsersToGroup>;
