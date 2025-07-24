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
    await queryInterface.createTable('verteks', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },

      UsulanId: Sequelize.INTEGER,
      SasaranId: Sequelize.INTEGER,
      status: Sequelize.INTEGER,
      keterangan: Sequelize.TEXT,
      namaPupr: Sequelize.STRING,
      jabatanPupr: Sequelize.STRING,
      nipPupr: Sequelize.STRING,
      telponPupr: Sequelize.STRING,
      namaSnvt: Sequelize.STRING,
      jabatanSnvt: Sequelize.STRING,
      nipSnvt: Sequelize.STRING,
      telponSnvt: Sequelize.STRING,
      namaPejKabKota: Sequelize.STRING,
      jabatanPejKabKota: Sequelize.STRING,
      nipPejKabKota: Sequelize.STRING,
      telponPejKabKota: Sequelize.STRING,
      dataLapangan1: Sequelize.TEXT,
      dataLapangan2: Sequelize.TEXT,
      dataLapangan3: Sequelize.TEXT,
      dataLapangan4: Sequelize.TEXT,
      dataLapangan5: Sequelize.TEXT,
      dataLapangan6: Sequelize.TEXT,
      dataLapangan7: Sequelize.TEXT,
      dataLapangan8: Sequelize.TEXT,
      dataLapangan9: Sequelize.TEXT,
      dataLapangan10: Sequelize.TEXT,
      dataLapangan11: Sequelize.TEXT,
      dataLapangan12: Sequelize.TEXT,
      dataLapangan13: Sequelize.TEXT,
      dataLapangan14: Sequelize.TEXT,
      dataLapangan15: Sequelize.TEXT,
      dataLapangan16: Sequelize.TEXT,
      dataLapangan17: Sequelize.TEXT,
      dataLapangan18: Sequelize.TEXT,
      dataLapangan19: Sequelize.TEXT,
      dataLapangan20: Sequelize.TEXT,
      dataLapangan21: Sequelize.TEXT,
      dataLapangan22: Sequelize.TEXT,
      dataLapangan23: Sequelize.TEXT,
      //rusun
      tglSurvei: Sequelize.DATE,
      surveyor: Sequelize.STRING,
      proposalAsli: Sequelize.BOOLEAN,
      legalitasLahan: Sequelize.BOOLEAN,
      sesuaiRTRW: Sequelize.BOOLEAN,
      sesuaiMasterPlan: Sequelize.BOOLEAN,
      kondisi: Sequelize.STRING,
      perkerasanJalan: Sequelize.STRING,
      sumberListrik: Sequelize.STRING,
      sumberAir: Sequelize.STRING,
      jarakKepusatKegiatan: Sequelize.STRING,
      kondisiTanah: Sequelize.STRING,
      kelayakanTeknis: Sequelize.BOOLEAN,
      //rusus
      namaLokasiDetail: Sequelize.TEXT,
      titikKoordinat: Sequelize.TEXT,
      peruntukan: Sequelize.TEXT,
      tglVertek: Sequelize.DATE,
      statusLahan: Sequelize.TEXT,
      rtrw: Sequelize.TEXT,
      luasLahan: Sequelize.TEXT,
      kondisiLahan: Sequelize.TEXT,
      kondisiJalanAkses: Sequelize.TEXT,
      jauhLahanDariJalanUtama: Sequelize.TEXT,
      sumberAirBersih: Sequelize.TEXT,
      sumberPenerbanganDanJarakGardu: Sequelize.TEXT,
      aksesSaluranPembuangan: Sequelize.TEXT,
      groundJarak: Sequelize.TEXT,
      sitePlant: Sequelize.TEXT,
      jenisTanah: Sequelize.TEXT,
      tipologiPermukaanTanah: Sequelize.TEXT,
      rawanBencana: Sequelize.TEXT,
      catatan: Sequelize.TEXT,
      fileFoto: Sequelize.TEXT,
      fileVertek: Sequelize.TEXT,

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
    await queryInterface.dropTable('verteks')
  },
}
