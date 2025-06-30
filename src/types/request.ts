import { Request } from 'express';

export type GetRequest<T> = Request & T;