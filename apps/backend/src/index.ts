import express from "express";
import v1Router from "./router/v1";
import db from "./db/index";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import session from "express-session";
import cookieParser from 'cookie-parser';
import authRoute from './router/auth'
import 'dotenv/config'

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const app = express();
app.use(express.json());

app.use("/v1", v1Router);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
  }),
);

function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback",
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        const user = await db.user.upsert({
          create: {
            email: profile.emails[0].value,
            name: profile.displayName,
            provider: "GOOGLE",
          },
          update: {
            name: profile.displayName,
          },
          where: {
            email: profile.emails[0].value,
          },
        });

        done(null, user);
      }
    )
  );
}

passport.serializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

initPassport();
app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use('/auth', authRoute);
app.use('/v1', v1Router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});