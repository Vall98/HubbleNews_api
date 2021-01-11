const Comment = require('../../models').comment;
const User = require('../../models').user;

function favorite(req, res) {
    console.log("Not implemented");
}

function getComments(req, res) {
    if (!req.query.id) {
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    Comment.findAll({where: {article_id: req.query.id}, include: [{ model: User, attributes: ["username", 'img'] }], order: [['updatedAt', 'DESC']]}).then((data) => {
        res.status(200).send(data);
    }).catch((err) => res.status(400).send({message: err}));
}

function comment(req, res) {
    if (!req.body.id || !req.body.comment) {
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    Comment.create({article_id: req.body.id, comment: req.body.comment, userId: req.user.id})
        .then((data) => res.status(200).send({comment: data.dataValues}))
        .catch((err) => res.status(400).send({message: err}));
}

module.exports = {
    favorite,
    getComments,
    comment
}