'use strict';
module.exports = function(sequelize, Sequelize) {
	var Comment = sequelize.define('comment', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		article_id: {
			type: Sequelize.STRING,
			allowNull: false
		},
		comment: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});
  return Comment;
};