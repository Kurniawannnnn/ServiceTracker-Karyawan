'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id_user:{
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nama_user: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Engineer', 'User'),
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    gambar: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user'
  });
  return user;
};