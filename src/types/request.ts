import { Request } from 'express';

export type GetRequest = Request & { token?: string };