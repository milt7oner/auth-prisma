import { Router } from "express";
import passport from "passport";
import { UserWithoutPassword } from "../types";
import { getToken,recoveryPassword,changePassword } from "./auth.controller";
const router = Router();
export type userToken = UserWithoutPassword ;
// login
router.post(
  "/login",
  passport.authenticate("local", { session: false }),getToken,
);
router.post(
  "/recovery",recoveryPassword,
);
router.post(
  "/change-password",changePassword,
);
export default router;
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operaciones relacionadas con la autenticación y contraseña
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/auth/recovery:
 *   post:
 *     summary: Recuperar contraseña
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Se ha enviado un correo electrónico de recuperación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               recoveryToken:
 *                 type: string
 *             required:
 *               - email
 *               - newPassword
 *               - recoveryToken
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       401:
 *         description: Token de recuperación inválido
 *       500:
 *         description: Error del servidor
 */
