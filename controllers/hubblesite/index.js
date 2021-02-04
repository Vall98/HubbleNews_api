const axios = require('axios')

const URL = "http://hubblesite.org/api/v3/";

function news(req, res)  {
    axios.get(URL + "news?page=" + req.query.page).then((data) => {
        res.send(data.data).status(200);
    }).catch((err) => {
        res.send({err: err}).status(400);
    });
}

function news_release(req, res) {
    axios.get(URL + "news_release/" + req.query.id).then((data) => {
        res.send(data.data).status(200);
    }).catch((err) => {
        res.send({err: err}).status(400);
    });
}

async function get_last() {
    return await axios.get(URL + "news_release/last");
}

module.exports = {
    news,
    news_release,
    get_last
}