const Comment = require('../../models').comment;
const User = require('../../models').user;
const Device = require('../../models').device;
const LastNew = require('../../models').last_new;
const get_last = require('../hubblesite').get_last;
const sendNotificationToAll = require('../device').sendNotificationToAll;
const sendNotification = require('../device').sendNotification;

const cron = require('node-schedule');

function check_news() {
    get_last().then((data) => {
        const last_id = data.data.news_id;
        LastNew.findOne({ where: { id: 1 } }).then((lastnew) => {
            if (lastnew.dataValues.new_id != last_id) {
                sendNotificationToAll(
                    {},
                    "Some space news is available !",
                    "Discover the latest news from the Hubble and James-Webb missions."
                );
                lastnew.update({new_id: last_id}).catch(err => console.log(err));
            }
        });
    });
}

check_news();
cron.scheduleJob('0 */4 * * *', check_news);

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

async function notifyTaggedPerson(req, anchor) {
    let words = req.body.comment.replace(/[\.,-\/#!$%\^&\*;:{}=\-`~()\+\?><\[\]\+]/g, "").split(" ");
    let allTokens = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i][0] == '@') {
            try {
                data = await User.findOne({ where: { username: words[i].substring(1) }, attributes: [], include: [{ model: Device, attributes: ["token"] }]});
                if (!allTokens.includes(data.device.token)) allTokens.push(data.device.token);
            } catch(err) {
                console.log(err);
            }
        }
    }
    if (allTokens.length > 0) sendNotification(allTokens, {page: "/newsdetails", anchor: anchor, article: req.body.id}, "We are talking about you !", "Somebody mentioned you in an article's comment.");
}

function comment(req, res) {
    if (!req.body.id || !req.body.comment) {
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    Comment.create({article_id: req.body.id, comment: req.body.comment, userId: req.user.id}).then((data) => {
        notifyTaggedPerson(req, data.id + "");
        res.status(200).send({comment: data.dataValues});
    }).catch((err) => res.status(400).send({message: err}));
}

module.exports = {
    favorite,
    getComments,
    comment
}