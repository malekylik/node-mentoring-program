import Joi from '@hapi/joi';

import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation'

const validator = createValidator();

const querySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().min(4).max(130).required(),
});

interface UserCreate extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: string,
    }
}

interface UserUpdate extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        id: string,
    },
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: string,
    }
}

export const CreateUpdateUserValidation = validator.body(querySchema);
export type UserCreateRequest = ValidatedRequest<UserCreate>;
export type UserUpdateRequest = ValidatedRequest<UserUpdate>;
