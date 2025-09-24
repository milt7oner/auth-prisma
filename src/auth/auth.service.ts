import bcrypt from "bcrypt";
import { getUserByEmail, editUser, getUserById } from "../user/user.service";
import { z } from "zod";
import { config } from "../config/config";
import { UserWithoutPassword, MessageRecovery } from "../types";
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

  const link = `http://myfrontend.com/recovery?token=${token}`;
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
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
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
  try {
    const payload = jwt.verify(token, config.jwtSecretRecovery);

    if (typeof payload.sub === "number") {
      const userId = payload.sub;

      const user = await getUserById(userId);

      if (user?.recoveryToken !== token) {
        throw boom.notFound("user no found "); // Devuelve el objeto de error personalizado
      }
      const hash = await bcrypt.hash(
        typeof newPassword === "string" ? newPassword : "",
        10,
      );
      await editUser(user.id, { recoveryToken: null, password: hash });
      return { message: "Password Change" };
    }
  } catch (e) {
    return e;
    // Devuelve el objeto de error personalizado
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
