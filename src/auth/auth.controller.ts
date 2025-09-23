import { Request, Response, NextFunction } from "express";
import { sendRecovery, signToken, changePasswordUser } from "./auth.service";
import boom from "@hapi/boom";
import { UserWithoutPassword } from "../types";

export const getToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw boom.unauthorized("Usuario no autorizado");
    }

    const user = req.user as UserWithoutPassword;
    const token = signToken(user);

    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};

export const recoveryPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const rta = await sendRecovery(email);

    res.json({ success: true, data: rta });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const rta = await changePasswordUser(token, newPassword);

    res.json({ success: true, data: rta });
  } catch (error) {
    next(error);
  }
};
