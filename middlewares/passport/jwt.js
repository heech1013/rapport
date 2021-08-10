const dotenv = require('dotenv');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const { User } = require('../../models');

dotenv.config();

module.exports = (passport) => {
  /* it assume that the client will send the JWT token in
    Authorization Header as a Bearer Token. */
  passport.use(new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    // By default, if authenticate fails, passport will respond with a 401 Unauthorized status
    function (jwtPayload, done) {
      /* find the user in db if(*) needed. This functionality may be omitted
        if you store everything you'll need in JWT payload. */
      User.findOne({ where: { id: jwtPayload.id } })
        .then(() => {
          return done(null, jwtPayload);  // jwt authenticate 미들웨어로 전달
        })
        .catch(error => {
          return done(error);
        });
    }
  ));
};