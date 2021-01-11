const fs = require('fs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').user ;

const PUB_KEY = fs.readFileSync(__dirname + '/secrets/id_rsa_pub.pem', 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: true  
};

passport.use('jwt', new JwtStrategy(options, function(req, jwt_payload, done) {
    User.findOne({ where: {id: jwt_payload.sub}}).then((user) => {
        if (user) {
            req.user = user;
            req.user.password = undefined;
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err) => {
        return done(err, false);
    });
}));

module.exports = passport;