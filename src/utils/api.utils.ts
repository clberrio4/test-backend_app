import { NextFunction, Request, Response } from "express";
import { isEmpty } from "lodash";
import { buildPaginator } from "typeorm-cursor-pagination";
import { User } from "../models/User";
import { AppError } from "./app.error";
import { v4 as uuid, validate } from "uuid";
import { HandleRespose } from "./responses";

export interface Paginator {
    nextPage: string;
    previusPage: string;
    order: number;
    limit: number;
}
const models = {
    users: User
}

export class ApiUtils {

    private handle: HandleRespose;

    constructor() {

    }



    public getUuid(): string {
        return uuid().toString();
    }

    public uuidValidate(uuid: string): boolean {
        return validate(uuid);
    }
}