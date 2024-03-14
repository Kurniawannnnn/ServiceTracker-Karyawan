'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async getAllData() {
      try {
        const pdData = await Pn.findAll();
        return pdData;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  Pn.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    subject: DataTypes.ENUM('Penambahan Network Link VPNIP', 'Penambahan Network Link Metro', 'Penambahan Network Link Siteto Site', 'Perubahan Network Link VPNIP', 'Perubahan Network Link Metro', 'Perubahan Network Link Site to Site',
      'Dismantle Network Link VPNIP', 'Dismantle Network Link Metro', 'Dismantle Network Link Siteto Site', 'Penambahan User VPN Cisco', 'Penghapusan User VPN Cisco', 'Penambahan Network NAT Firewall', 'Perubahan Network NAT Firewall',
      'Penghapusan Network NAT Firewall', 'Penambahan Domain', 'Perubahan Domain', 'Penghapusan Domain', 'Penambahan Routing Network', 'Perubahan Routing Network', 'Penghapusan Routing Network', 'Penambahan Record DNS', 'Perubahan Record DNS',
      'Penghapusan Record DNS', 'Penambahan Monitoring Network', 'Perubahan Config Monitoring Network', 'Penghapusan Config Monitoring Network', 'Penambahan Perangkat Network', 'Dismantle Perangkat Network', 'Penambahan DHCP Member Perangkat Kerja',
      'Perubahan DHCP Perangkat Kerja', 'Penambahan Konfigurasi Network GCP', 'Perubahan Konfigurasi Network GCP', 'Penghapusan Konfigurasi Network GCP', 'Provisioning Laptop'),
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
  }, {
    sequelize,
    modelName: 'pn',
  });
  return Pn;
}