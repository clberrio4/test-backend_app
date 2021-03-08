import { Response } from "express";
import { omit } from "lodash";
export interface Responses {
    detail?: string;
    message?: string;
    token?: string | undefined;
    statusCode: number;


}
export interface ResponseData { data: any; statusCode: number; }

export class HandleRespose {

    public responseNotData(resData: Responses, res: Response): void {
        res.status(resData.statusCode).json({ ...omit(resData, ["statusCode"]) });

    }

    public responseData(resData: ResponseData, res: Response): void {
        res.status(resData.statusCode).json({ ...resData.data });

    }
}