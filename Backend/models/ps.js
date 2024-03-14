'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ps extends Model {
    static associate(models) {
      // Define associations here, if any
    }

    static async getAllData() {
      try {
        const psData = await Ps.findAll();
        return psData;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  
  Ps.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: DataTypes.ENUM('Pembuatan Server','Penambahan User Server','Penghapusan User Server','Instalasi Aplikasi Server','Penambahan Configurasi Aplikasi Server','Penambahan User FTP','Penambahan Directory FTP','Cloud Migration Support','Develop DevSecOps Pipeline'),
      assignment: DataTypes.STRING,
      status: DataTypes.ENUM('On Progress', 'Done'),
      requester: DataTypes.STRING,
      start_date: DataTypes.DATE,
      start_time: DataTypes.TIME,
      close_date: DataTypes.DATE,
      close_time: DataTypes.TIME,
      executor: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      duration: DataTypes.TIME,
      achievement: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: 'ps',
    }
  );
  return Ps;
};