import { Request, Response, NextFunction } from 'express';
import { Boom } from '@hapi/boom';
// Middleware de manejo de errores global
export function logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log("logError")
  console.error('Error:', err);
  next(err)
};
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
  console.log("errorHan")
  console.log(err)
  res.status(500).json(
   {
    message:err.message,
    stack: err.stack,
   }
  )
}
export function boomErrorHandler(err: Boom, req: Request, res: Response, next: NextFunction): void {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }else{
    next(err);
  }

}

