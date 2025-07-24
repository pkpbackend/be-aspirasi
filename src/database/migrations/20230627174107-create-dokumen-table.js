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
    await queryInterface.createTable('dokumens', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },

      file: Sequelize.TEXT,
      status: Sequelize.INTEGER,
      lengkap: Sequelize.INTEGER,
      model: Sequelize.STRING,
      ModelId: Sequelize.INTEGER,
      MasterDokumenId: Sequelize.INTEGER,
      MasterDokumen: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      keterangan: Sequelize.TEXT,
      valueText: Sequelize.STRING,

      ditRususDokumenId: Sequelize.INTEGER,
      ditRusunDokumenId: Sequelize.INTEGER,
      ditRuwaDokumenId: Sequelize.INTEGER,
      ditRukDokumenId: Sequelize.INTEGER,

      ditRususVerminId: Sequelize.INTEGER,

      PxMasterId: Sequelize.INTEGER,

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
    await queryInterface.dropTable('dokumens')
  },
}
