import Joi from '@hapi/joi';

import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation'

import { Permission } from 'app/types';

const validator = createValidator();

const querySchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).unique().required(),
});

interface GroupCreate extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        permissions: Array<Permission>,
    }
}

interface GroupUpdate extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        id: string,
    },
    [ContainerTypes.Body]: {
        name: string,
        permissions: Array<Permission>,
    }
}

export const CreateUpdateGroupValidation = validator.body(querySchema);
export type GroupCreateRequest = ValidatedRequest<GroupCreate>;
export type GroupUpdateRequest = ValidatedRequest<GroupUpdate>;
