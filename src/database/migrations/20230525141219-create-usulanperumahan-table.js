'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('usulanperumahans', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      UsulanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      namaPerumahan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jmlRumahUmum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      presentaseRumahUmum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jmlRumahMenengah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      presentaseRumahMenengah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jmlRumahMewah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      presentaseRumahMewah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('usulanperumahans')
  },
}
