'use strict';
module.exports = function(sequelize, Sequelize) {
	var Favorite = sequelize.define('favorite', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		article_id: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});
  return Favorite;
};