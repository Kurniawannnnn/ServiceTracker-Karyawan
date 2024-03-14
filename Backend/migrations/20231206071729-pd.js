'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pd', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.ENUM('Pembuatan Database Schema','Pembuatan Database User','Pemberian Hak Akses pada Database User','Perubahan Hak Akses pada Database User','Penghapusan Hak Akses pada Database User','Query Tuning & Review','Provisioning Database Object','Maintenance Support','Pembuatan Report Database','Pembuatan Database Instance','Pebuatan Data Retensi & Housekeeping','Migrasi Database/Data','Implementasi Fitur Database','Patching/Update Database')
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
      achievement: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Pd');
  }
};


