'use strict';
module.exports = function(sequelize, Sequelize) {
	var Device = sequelize.define('device', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		token: {
			type: Sequelize.STRING,
			allowNull: false
		},
		uuid: {
			type: Sequelize.STRING,
			allowNull: false
		},
		latitude: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		longitude: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	});
  return Device;
};