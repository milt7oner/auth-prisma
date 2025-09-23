import bcrypt from "bcrypt";
import { getUserByEmail, editUser, getUserById } from "./user.service";
import { z } from "zod";
import { config } from "../../config/config";
import { UserWithoutPassword, MessageRecovery } from "../routes/v1/types";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import boom from "@hapi/boom";

export type userToken = UserWithoutPassword;

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const RecoverySchema = z.object({
  email: z.string().email(),
});

const ChangePasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export async function sendRecovery(email: string) {
  const { email: validatedEmail } = RecoverySchema.parse({ email });

  const user = await getUserByEmail(validatedEmail);
  if (!user) {
    throw boom.notFound("User not found");
  }

  const payload = { sub: user.id };
  const token = jwt.sign(payload, config.jwtSecretRecovery, { expiresIn: "15m" });

  const link = `${config.frontendUrl}/recovery?token=${token}`;
  await editUser(user.id, { recoveryToken: token });

  const mail: MessageRecovery = {
    from: config.emailRecobery,
    to: user.email,
    subject: "Recupera tu contraseña",
    html: `<b>Haz clic en este link para recuperar tu contraseña: ${link}</b>`,
  };

  await sendMail(mail);
  return { success: true, data: { message: "Recovery email sent" } };
}

export async function sendMail(infoMail: MessageRecovery) {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    secure: true,
    port: config.smtpPort,
    auth: {
      user: config.emailRecobery,
      pass: config.emailSecret,
    },
  });
  await transporter.sendMail(infoMail);
  return { success: true, data: { message: "Mail sent" } };
}

export function signToken(user: userToken) {
  const payload = { sub: user.id, role: user.role };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

  return { success: true, data: { user, token } };
}

export async function changePasswordUser(token: string, newPassword: string) {
  const { token: validatedToken, newPassword: validatedPassword } = ChangePasswordSchema.parse({
    token,
    newPassword,
  });

  try {
    const payload = jwt.verify(validatedToken, config.jwtSecretRecovery) as jwt.JwtPayload;

    if (!payload.sub) throw boom.unauthorized("Invalid token");

    const user = await getUserById(payload.sub as number);

    if (!user || user.recoveryToken !== validatedToken) {
      throw boom.unauthorized("Invalid or expired token");
    }

    const hash = await bcrypt.hash(validatedPassword, 10);
    await editUser(user.id, { recoveryToken: null, password: hash });

    return { success: true, data: { message: "Password changed successfully" } };
  } catch (error) {
    throw boom.unauthorized("Invalid or expired token");
  }
}

export async function getUser(email: string, password: string) {
  const { email: validatedEmail, password: validatedPassword } = LoginSchema.parse({ email, password });

  const user = await getUserByEmail(validatedEmail);
  if (!user) {
    throw boom.notFound("User not found");
  }

  const isMatch = await bcrypt.compare(validatedPassword, user.password || "");
  if (!isMatch) {
    throw boom.unauthorized("Invalid credentials");
  }

  const { password: _, recoveryToken: __, ...userWithoutSensitiveData } = user;
  return { success: true, data: userWithoutSensitiveData };
}
