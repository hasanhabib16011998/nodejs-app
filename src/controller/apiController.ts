import { NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpError';

export default {
    self: (req: Request, res: Response, next: NextFunction) => {
        try{
            throw new Error('This is error')
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch(err) {
            httpError(next, err, req, 500)
        }

    }
}