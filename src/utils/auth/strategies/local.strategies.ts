import { Strategy } from "passport-local";
import { getUser } from "../../../auth/auth.service";
import { z } from "zod";
import boom  from "@hapi/boom";


const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});



const LocalStrategy = new Strategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const loginData = LoginSchema.parse({ email, password });
      const user = await getUser(loginData.email, loginData.password);
      // Verificar si el usuario existe y si su estado es true
      if (user && user.state === true) {
        return done(null, user);
      } else {
        return done(boom.unauthorized('User is not allowed to login'), false);
      }
    } catch (error) {
      return done(boom.notFound('User not found'), false);
    }
  },
);


export default LocalStrategy;
