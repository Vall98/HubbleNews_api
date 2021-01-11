'use strict';
module.exports = function(sequelize, Sequelize) {
	var User = sequelize.define('user', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		username: {
			type: Sequelize.TEXT
		},
		email: {
			type: Sequelize.STRING,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		img: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: "https://ts3.wondercube.fr/images/default_profile.png"
		}
	});
  return User;
};