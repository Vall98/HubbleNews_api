const fs = require('fs');
var path = require('path');
const sign = require("../../passport/sign");
const User = require("../../models").user;

function signup(req, res, next) {
    if (!req.body.username || !req.body.password) return res.status(401).send({err: "Missing credentials"});
    return sign.signup(req, req.body.username, req.body.password, function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(401).send(info);
        const token = sign.generateToken(user);
        return res.status(200).send({ success: true, token: token.token, expiresIn: token.expires, user: user });
    });
}

function signin(req, res, next) {
    if (!req.body.username || !req.body.password) return res.status(401).send({err: "Missing credentials"});
    return sign.signin(req, req.body.username, req.body.password, function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(401).send(info);
        const token = sign.generateToken(user);
        return res.status(200).send({ success: true, token: token.token, expiresIn: token.expires, user: user });
    });
}

function me(req, res) {
    res.status(200).send(req.user);
}

/*function logout(req, res) {
    req.logout();
    res.send({message: "Success"}).status(200);
}*/

function updateInfos(req, res) {
    if (!req.body.oldPass) {
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    User.findOne({ where: {id: req.user.id}}).then((user) => {
        if (!user || !sign.isValidPassword(user.password, req.body.oldPass)) {
            res.status(401).send({message: "Unauthorized"});
        } else {
            let userData = {};
            if (req.body.username) {
                userData.username = req.body.username;
                req.user.username = req.body.username;
            }
            if (req.body.email) {
                userData.email = req.body.email;
                req.user.email = req.body.email;
            }
            if (req.body.newPass) userData.password = bcrypt.generateHash(req.body.newPass);
            User.update(userData, {where: { id: req.user.id }})
            .then((data) => res.status(200).send({user: req.user}))
            .catch((err) => res.status(400).send({message: err}));
        }
    }).catch((err) => res.status(400).send({message: err}));
}

function writeImage(name, file) {
    if (fs.existsSync(name)) {
        fs.unlinkSync(name);
    }
    fs.writeFileSync(name, file.toString().split(';base64,').pop(), 'base64');
    return name;
}

function editImage(req, res) {
    if (!req.body.img || !req.body.ext || !req.user) {
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    req.body.ext = req.body.ext.toString().toLowerCase();
    req.user.img = "https://ts3.wondercube.fr/images/profile/" + req.user.username + req.body.ext;
    const name = path.join(path.dirname(require.main.filename), "../images/profile/", req.user.username + req.body.ext);
    writeImage(name, req.body.img);
    User.update(req.user.dataValues, { where: {id: req.user.id } })
    .then((data) => me(req, res))
    .catch((err) => res.status(400).send({error: err}));
}

module.exports = {
    signup,
    signin,
    //logout,
    me,
    updateInfos,
    editImage
}