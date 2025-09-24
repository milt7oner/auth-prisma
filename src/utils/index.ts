import passport from 'passport';
import LocalStrategy  from './auth/strategies/local.strategies';
import JwtStrategy  from './auth/strategies/jwt.strategies';

passport.use(LocalStrategy);
passport.use(JwtStrategy);
