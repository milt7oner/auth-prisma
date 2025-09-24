import { Request, Response } from "express";
import boom from "@hapi/boom";
import {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  editUser,
  deleteUserById,
} from "./user.service";

// Helper para respuestas consistentes
const sendResponse = (res: Response, status: number, success: boolean, data?: any, message?: string) => {
  return res.status(status).json({ success, data, message });
};

export const userCreate = async (req: Request, res: Response) => {
  try {
    const { userData, value } = req.body;
    if (!userData) {
      return sendResponse(res, 400, false, null, "User data is required");
    }

    const newUser = await createUser(userData, value);
    return sendResponse(res, 201, true, newUser, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    if (boom.isBoom(error)) {
      return sendResponse(res, error.output.statusCode, false, null, error.message);
    }
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};

export const usersGet = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return sendResponse(res, 200, true, users);
  } catch (error) {
    console.error("Error getting users:", error);
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};

export const userGetByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, false, null, "Email is required");
    }

    const user = await getUserByEmail(email);
    return sendResponse(res, 200, true, user);
  } catch (error) {
    console.error("Error getting user by email:", error);
    if (boom.isBoom(error)) {
      return sendResponse(res, error.output.statusCode, false, null, error.message);
    }
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};


export const findUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return sendResponse(res, 400, false, null, "Invalid user ID");
    }

    const user = await getUserById(userId);
    return sendResponse(res, 200, true, user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    if (boom.isBoom(error)) {
      return sendResponse(res, error.output.statusCode, false, null, error.message);
    }
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};

export const userEdit = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const userData = req.body;

    if (isNaN(userId)) {
      return sendResponse(res, 400, false, null, "Invalid user ID");
    }

    const updatedUser = await editUser(userId, userData);
    return sendResponse(res, 200, true, updatedUser, "User updated successfully");
  } catch (error) {
    console.error("Error editing user:", error);
    if (boom.isBoom(error)) {
      return sendResponse(res, error.output.statusCode, false, null, error.message);
    }
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};

export const userDeleteById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return sendResponse(res, 400, false, null, "Invalid user ID");
    }

    const deletedUser = await deleteUserById(userId);
    return sendResponse(res, 200, true, deletedUser, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    if (boom.isBoom(error)) {
      return sendResponse(res, error.output.statusCode, false, null, error.message);
    }
    return sendResponse(res, 500, false, null, "Internal server error");
  }
};

