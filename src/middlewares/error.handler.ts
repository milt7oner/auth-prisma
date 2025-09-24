import { Request, Response, NextFunction } from "express";
import { Boom } from "@hapi/boom";

export function logErrors(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error capturado:", err);
  next(err);
}

export function boomErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ((err as Boom).isBoom) {
    const { output } = (err as Boom);
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = 500;

  if (err instanceof Error) {
    return res.status(statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }

  return res.status(statusCode).json({
    message: "Unknown error occurred",
  });
}
