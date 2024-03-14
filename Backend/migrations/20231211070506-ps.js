'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.ENUM('Pembuatan Server','Penambahan User Server','Penghapusan User Server','Instalasi Aplikasi Server','Penghapusan Aplikasi Server','Penambahan Configurasi Aplikasi Server','Penambahan User FTP','Penambahan Directory FTP','Cloud Migration Support','Develop DevSecOps Pipeline') // Sesuaikan dengan nilai enum yang sesuai
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
    await queryInterface.dropTable('ps');
  }
};