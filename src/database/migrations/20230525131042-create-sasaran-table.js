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
    await queryInterface.createTable('sasarans', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      UsulanId: Sequelize.INTEGER,
      ProvinsiId: Sequelize.INTEGER,
      CityId: Sequelize.INTEGER,
      KecamatanId: Sequelize.INTEGER,
      DesaId: Sequelize.BIGINT,
      KecamatanLainnya: Sequelize.STRING,
      DesaLainnya: Sequelize.STRING,
      MasterKegiatanId: Sequelize.INTEGER,
      lat: Sequelize.STRING,
      lng: Sequelize.STRING,
      jumlahUnit: Sequelize.INTEGER,
      jumlahUnitPk: Sequelize.INTEGER,
      jumlahUnitPb: Sequelize.INTEGER,
      rtlh: Sequelize.TEXT,

      //relationships
      Provinsi: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      City: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      Kecamatan: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      Desa: {
        type: Sequelize.JSON,
        allowNull: true,
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
    await queryInterface.dropTable('sasarans')
  },
}
