const router = require('express').Router();
const passport = require("passport");
const { userModel } = require('../model/user');
const OpenIDConnectStrategy = require("passport-openidconnect").Strategy;

passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: "https://" + process.env.AUTH0_DOMAIN + "/",
        authorizationURL: "https://" + process.env.AUTH0_DOMAIN + "/authorize",
        tokenURL: "https://" + process.env.AUTH0_DOMAIN + "/oauth/token",
        userInfoURL: "https://" + process.env.AUTH0_DOMAIN + "/userinfo",
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: "/oauth2/redirect",
        scope: ["openid","profile","email"],
      },
      async function verify(issuer, profile, cb) {
        console.log('profile', profile)
        try {
          const res = await userModel.findOne({ authID: profile.id });
        if (!res) {
          const newUser = await userModel.create({
            authID : profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          const user = {id : newUser._id, authID : newUser.authID, name : newUser.name, email : newUser.email}
          cb(null, user);
        } else cb(null, {id : res._id, authID : res.authID, name : res.name, email : res.email});
        } catch (error) {
          cb(error,false)
        }
      }
    )
  );

router.get('/login', passport.authenticate('openidconnect'));

router.get('/oauth2/redirect', passport.authenticate('openidconnect', {
  successRedirect: 'http://localhost:5173',
  failureRedirect: '/login'
}));

module.exports = router;