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
    await queryInterface.createTable('vermins', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      status: Sequelize.INTEGER,
      keterangan: Sequelize.TEXT,
      UsulanId: Sequelize.INTEGER,
      ditRususVerminId: Sequelize.BIGINT,
      suratPermohonan: Sequelize.BOOLEAN,
      proposal: Sequelize.BOOLEAN,
      fcSertifikatTanah: Sequelize.BOOLEAN,
      suratPermohonanKet: Sequelize.STRING,
      proposalKet: Sequelize.STRING,
      fcSertifikatTanahKet: Sequelize.STRING,
      statusTanah: Sequelize.STRING,
      statusTanahKet: Sequelize.STRING,
      luasTanah: Sequelize.STRING,
      catatan: Sequelize.STRING,

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
    await queryInterface.dropTable('vermins')
  },
}
