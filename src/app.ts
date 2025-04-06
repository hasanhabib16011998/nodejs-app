import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import router from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constant/responseMessage';
import httpError from './utils/httpError';

const app: Application = express();

//middleware
app.use(express.json())
app.use(express.static(path.join(__dirname,'../', 'public')))

//routes
app.use('/api/v1', router);

//404 handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try{
        throw new Error(responseMessage.NOT_FOUND('Route'))
    } catch(err) {
        httpError(next,err,req,404)
    }
})

//Global Error Handler
app.use(globalErrorHandler)

export default app;