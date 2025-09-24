import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { config } from "../config/config";
import { User } from "../types";
// Definir el esquema de validación para la API key
const ApiKeySchema = z.string();

// Middleware para verificar la API key
export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.headers["api"];

    // Validar la API key utilizando el esquema definido
    if (ApiKeySchema.parse(apiKey) === config.apiKey) {
      // Si la API key es válida, continuar con el siguiente middleware
      next();
    }else{
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    // Si se produce un error de validación, enviar una respuesta HTTP con un estado de "no autorizado"
    res.status(401).json({ message: "Unauthorized" });
  }
};

export function checkRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (!user || !roles.includes(user.role)) {
      res.status(401).json({ error: 'Unauthorized', message: 'Unauthorized' });
    } else {
      next()
    }
  };
}

