import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';

type AnyZodObject = ZodObject<any>;


const schemaValidation = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            })
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json(
                    error.issues.map((issue) => ({
                        path: issue.path,
                        message: issue.message,
                    })),
                );
            } else {
                next(error);
            }
        }
    }
}

export default schemaValidation;