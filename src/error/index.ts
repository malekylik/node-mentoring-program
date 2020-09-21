export enum SequelizeError {
    UniqueConstraint = 'SequelizeUniqueConstraintError',
}

export type Error<T> = {
    message: string,
    payload: T,
};

export function createError<T>(message: string, payload: T): Error<T> {
    return {
        message,
        payload,
    };
}
