const app = require('express')();
const bodyParser = require('body-parser');
const router = require('./router/router');
const models = require('./models');
const passport = require('passport');

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
app.use(passport.initialize());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", false);
    next();
});

app.listen(process.env.API_PORT, function () {
    console.log('Server listening on port ' + process.env.API_PORT + '.');
});

//Sync Database
for (let db in models.sequelize) {
    models.sequelize[db].sync().then(function() {
        console.log('Database Update done: ' + models.sequelize[db].connectionManager.config.database);
    }).catch(function(err) {
        console.log(err, "Something went wrong with the Database Update: " + models.sequelize[db].connectionManager.config.database);
    });
}

app.use('/', router);