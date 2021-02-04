const Device = require('../../models').device;
const firebaseKey = require('../../secrets/firebase.json');
const firebase = require('firebase-admin');
const cron = require('node-schedule');
const axios = require('axios');
const Op = require('sequelize').Op;

const API_KEY = require('../../secrets/api_key.js').API_KEY;
const URL = "https://api.n2yo.com/rest/v1/satellite/above/";
const ISS_ID = 25544;

var devicesSeeingIss = [];

async function isIssInMySky(device) {
    let suffix = device.latitude + "/" + device.longitude + "/0/90/2?apiKey=" + API_KEY;
    data = await axios.get(URL + suffix);
    sat = data.data.above;
    for (let j = 0; j < sat.length; j++) {
        if (sat[j].satid == ISS_ID) return true;
    }
    return false;
}

function removeDeviceFromArray(deviceId) {
    let index = devicesSeeingIss.indexOf(deviceId);
    if (index > -1) {
        devicesSeeingIss.splice(index, 1);
    }
} 

async function check_iss() {
    let notifTokens = [];
    Device.findAll({where: {latitude: {[Op.ne]: null}, longitude: {[Op.ne]: null}}}).then(async function(device) {
        for (let i = 0; i < device.length; i++) {
            let deviceId = device[i].id;
            if (await isIssInMySky(device[i])) {
                if (!devicesSeeingIss.includes(deviceId)) {
                    devicesSeeingIss.push(deviceId);
                    notifTokens.push(device[i].token);
                }
            } else {
                removeDeviceFromArray(deviceId);
            }
        }
        if (notifTokens.length > 0)
            sendNotification(notifTokens, {page: "/iss"}, "ISS is over the horizon !", "If the sky is dark enough, you may see the ISS.");
    }).catch((err) => console.log(err));
};

check_iss();
cron.scheduleJob('*/3 * * * *', check_iss);

firebase.initializeApp({
    credential: firebase.credential.cert(firebaseKey)
});

function registerToken(req, res) {
    if (!req.body.uuid || !req.body.token) { 
        res.status(403).send({message: "Missing parameters"});
        return;
    }
    newValues = {};
    newValues.token = req.body.token;
    newValues.uuid = req.body.uuid;
    newValues.latitude = req.body.latitude;
    newValues.longitude = req.body.longitude;
    Device.findOne({ where: { uuid: req.body.uuid } })
        .then(function(device) {
            if (device) {
                device.update(newValues)
                    .then((data) => res.status(200).send({success: true}))
                    .catch((err) => res.status(400).send({success: false, message: err}));
            } else {
                Device.create(newValues)
                    .then((data) => res.status(200).send({success: true}))
                    .catch((err) => res.status(400).send({success: false, message: err}));
            }
        }).catch((err) => res.status(400).send({message: err}));
}

function sendNotification(tokens, data, title, body) {
    firebase.messaging().sendMulticast({
        'tokens': tokens,
        'notification': {
            'body': body,
            'title': title
        },
        'data': data,
        android: {
            notification: {
                image: 'https://ts3.wondercube.fr/images/logo.png'
            }
        },
        fcm_options: {
            image: 'https://ts3.wondercube.fr/images/logo.png'
        },
        webpush: {
            headers: {
                image: 'https://ts3.wondercube.fr/images/logo.png'
            }
        }
    });
}

function sendNotificationToAll(data, title, body) {
    tokens = [];
    Device.findAll({ attributes: ['token'] }).then((devices) => {
        for (let i = 0; i < devices.length; i++) {
            tokens.push(devices[i].token);
        }
        sendNotification(tokens, data, title, body);
    }).catch((err) => console.log(err));
}

module.exports = {
    registerToken,
    sendNotification,
    sendNotificationToAll
}