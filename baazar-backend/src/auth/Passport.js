import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function verify(accessToken, refreshToken, profile, done) {
      try {
        // ✅ Safe email extraction
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(null, false);
        }

        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (!user) {
          user = await User.create({
            name:
              profile.displayName ||
              profile.name?.givenName ||
              email.split("@")[0],
            email,
            googleId: profile.id,
            isVerified: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        }

        // ✅ THIS MUST RETURN USER
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
