'use strict';
module.exports = function(sequelize, Sequelize) {
	var LastNew = sequelize.define('last_new', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		new_id: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});
  return LastNew;
};