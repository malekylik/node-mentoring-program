import { Error } from 'app/error/index';

export interface ErrorLogInfo<T> {
    methodName: string;
    error: Error<T>;
    code?: number;
}
