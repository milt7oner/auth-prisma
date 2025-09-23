import { UserWithoutPassword } from "./index";

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}
