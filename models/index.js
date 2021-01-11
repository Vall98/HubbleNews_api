'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = {};

const databases = Object.keys(config.databases);
for(let i = 0; i < databases.length; ++i) {
    let database = databases[i];
    sequelize[database] = new Sequelize(config.databases[database].path, config.username, config.password, config);
    fs
      .readdirSync(path.join(__dirname, database))
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        const model = require(path.join(__dirname, database, file))(sequelize[database], Sequelize.DataTypes);
        db[model.name] = model;
      });
}

db['user'].hasMany(db['comment']);
db['comment'].belongsTo(db['user']);
db['user'].hasMany(db['favorite']);
db['favorite'].belongsTo(db['user']);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
