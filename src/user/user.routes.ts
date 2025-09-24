import { Router } from 'express';
import {
  userCreate,
  userDeleteById,
  userEdit,
  findUserById ,
  usersGet,
} from './user.controller';
import { IdParamSchema } from './user.schema';
import schemaValidation from '../middlewares/schemaValidator.middleware';
import { checkRoles } from '../middlewares/auth.handler';
import passport from 'passport';


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               recovery_token:
 *                 type: string
 *               userName:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date-time
 *               state:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', userCreate);


/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('ADMIN'),usersGet);// 


/**
 * @swagger
 * /id/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/id/:id',passport.authenticate('jwt', { session: false }), checkRoles('ADMIN'), findUserById );


/**
 * @swagger
 * /id/{id}/edit:
 *   put:
 *     summary: Edit a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User object with updated information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               recovery_token:
 *                 type: string
 *               userName:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date-time
 *               state:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.put('/id/:id/edit', passport.authenticate('jwt', { session: false }), checkRoles('ADMIN'), userEdit);


/**
 * @swagger
 * /id/{id}/delete:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/id/:id/delete', passport.authenticate('jwt', { session: false }), checkRoles('ADMIN'), userDeleteById);

export default router;

