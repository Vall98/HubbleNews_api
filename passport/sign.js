const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models').user;
const hasher = require('bcrypt');
const saltRounds = 10;

const PRIV_KEY = fs.readFileSync(__dirname + '/secrets/id_rsa_priv.pem', 'utf8');

function generateHash(password) {
    return hasher.hashSync(password, saltRounds);
};

function isValidPassword(userpass, password) {
    if (!userpass || !password) return false;
    return hasher.compareSync(password, userpass);
}

function generateToken(user) {
    const id = user.id;
    const expiresIn = '1d';
    
    const payload = {
        sub: id,
        iat: Date.now()
    };
    
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    };
}

function signin(req, username, password, done) {
    User.findOne({ where: { username : username }}).then((user) => {
        if (!user || !isValidPassword(user.password, password)) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        user.password = undefined;
        user.last_login = Date.now();
        User.update({ last_login: user.last_login }, { where: { id: user.id } });
        return done(null, user);
    }).catch((err) => { return done(null, false, { message: err.message}); });
}

function signup(req, username, password, done) {
    User.findOne({ where: { username: username } }).then((user) => {
        if (!req.body.email) return done(null, false, { message: 'Please specify an email'});
        if (user) return done(null, false, { message: 'That username is already taken' });
        User.findOne({ where: { email: req.body.email } }).then((testedUser) => {
            if (testedUser) return done(null, false, { message: 'That email is already taken' });
            var userPassword = generateHash(password);
            var data = {
                username: username,
                password: userPassword,
                email: req.body.email
            };
            User.create(data).then((newUser, created) => {
                if (!newUser) return done(null, false);
                newUser.password = undefined;
                return done(null, newUser);
            }).catch((err) => { return done(null, false, { message: err.message}); });
        }).catch((err) => { return done(null, false, { message: err.message}); });
    }).catch((err) => { return done(null, false, { message: err.message}); });
}

module.exports = {
    signin,
    signup,
    generateToken,
    isValidPassword,
    generateHash
}