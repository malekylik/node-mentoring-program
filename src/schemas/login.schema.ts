import Joi from '@hapi/joi';

import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation'

const validator = createValidator();

const querySchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
});

interface Loggin extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        password: string,
    }
}

export const LoginValidation = validator.body(querySchema);
export type LoginRequest = ValidatedRequest<Loggin>;
