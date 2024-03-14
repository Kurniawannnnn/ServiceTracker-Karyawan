'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pd extends Model {
    static associate(models) {
      // Define associations here, if any
    }

    static async getAllData() {
      try {
        const pdData = await Pd.findAll();
        return pdData;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  Pd.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: DataTypes.ENUM('Pembuatan Database Schema', 'Pembuatan Database User', 'Pemberian Hak Akses pada Database User', 'Perubahan Hak Akses pada Database User', 'Penghapusan Hak Akses pada Database User', 'Query Tuning & Review', 'Provisioning Database Object', 'Maintenance Support', 'Pembuatan Report Database', 'Pembuatan Database Instance', 'Pebuatan Data Retensi & Housekeeping', 'Migrasi Database/Data', 'Implementasi Fitur Database', 'Patching/Update Database'),
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
      modelName: 'pds',
    }
  );
  return Pd;
};