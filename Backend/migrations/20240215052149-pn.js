'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pn', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.ENUM('Penambahan Network Link VPNIP', 'Penambahan Network Link Metro', 'Penambahan Network Link Siteto Site', 'Perubahan Network Link VPNIP', 'Perubahan Network Link Metro', 'Perubahan Network Link Site to Site',
          'Dismantle Network Link VPNIP', 'Dismantle Network Link Metro', 'Dismantle Network Link Siteto Site', 'Penambahan User VPN Cisco', 'Penghapusan User VPN Cisco', 'Penambahan Network NAT Firewall', 'Perubahan Network NAT Firewall',
          'Penghapusan Network NAT Firewall', 'Penambahan Domain', 'Perubahan Domain', 'Penghapusan Domain', 'Penambahan Routing Network', 'Perubahan Routing Network', 'Penghapusan Routing Network', 'Penambahan Record DNS', 'Perubahan Record DNS',
          'Penghapusan Record DNS', 'Penambahan Monitoring Network', 'Perubahan Config Monitoring Network', 'Penghapusan Config Monitoring Network', 'Penambahan Perangkat Network', 'Dismantle Perangkat Network', 'Penambahan DHCP Member Perangkat Kerja',
          'Perubahan DHCP Perangkat Kerja', 'Penambahan Konfigurasi Network GCP', 'Perubahan Konfigurasi Network GCP', 'Penghapusan Konfigurasi Network GCP', 'Provisioning Laptop') // Sesuaikan dengan nilai enum yang sesuai
      },
      assignment: {
        type: Sequelize.STRING(255)
      },
      status: {
        type: Sequelize.ENUM('On Progress', 'Done')
      },
      requester: {
        type: Sequelize.STRING(255)
      },
      start_date: {
        type: Sequelize.DATEONLY
      },
      start_time: {
        type: Sequelize.TIME
      },
      close_date: {
        type: Sequelize.DATEONLY
      },
      close_time: {
        type: Sequelize.TIME
      },
      executor: {
        type: Sequelize.STRING(255),
        primaryKey: true
      },
      duration: {
        type: Sequelize.TIME
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pn');
  }
};