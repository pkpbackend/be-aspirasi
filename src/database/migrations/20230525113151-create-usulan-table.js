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
    await queryInterface.createTable('usulans', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      noUsulan: Sequelize.STRING,
      sipRoId: Sequelize.STRING,
      noSurat: Sequelize.STRING,
      tglSurat: Sequelize.DATE,
      PenerimaManfaatId: Sequelize.STRING,
      ProvinsiId: Sequelize.INTEGER,
      CityId: Sequelize.INTEGER,
      DesaId: Sequelize.BIGINT,
      KecamatanId: Sequelize.INTEGER,
      jumlahUnit: Sequelize.INTEGER,
      jumlahUnitPk: Sequelize.INTEGER,
      jumlahUnitPb: Sequelize.INTEGER,
      jumlahTb: Sequelize.INTEGER,
      keterangan: Sequelize.TEXT,
      kegiatan: Sequelize.TEXT,
      tahunPengajuan: Sequelize.INTEGER,
      telponPengusul: Sequelize.STRING,
      picPengusul: Sequelize.STRING,
      jabatanPic: Sequelize.STRING,
      direktif: Sequelize.BOOLEAN,
      statusVermin: Sequelize.INTEGER,
      statusVerminId: Sequelize.INTEGER,
      statusVerminUpdatedAt: Sequelize.DATE,
      statusVertek: Sequelize.INTEGER,
      statusVertekUpdatedAt: Sequelize.DATE,
      statusVertekId: Sequelize.INTEGER,
      keteranganVertek: Sequelize.TEXT,
      statusPenetapan: Sequelize.INTEGER,
      statusPenetapanUpdatedAt: Sequelize.DATE,
      statusPenetapanId: Sequelize.INTEGER,
      pengusul: Sequelize.TEXT,
      SatkerId: Sequelize.INTEGER,
      statusTerkirim: Sequelize.STRING,
      tahunProposal: Sequelize.STRING,
      kodeProposal: Sequelize.STRING,
      instansi: Sequelize.STRING,
      alamatInstansi: Sequelize.STRING,
      tglDisposisi: Sequelize.DATE,
      pemberiDisposisi: Sequelize.STRING,
      disposisi: Sequelize.STRING,
      nomorAgenda: Sequelize.STRING,
      usulanAspirasi: Sequelize.STRING,
      alamatLokasi: Sequelize.STRING, // di pake sama rusun(default), ruk(lokasiPerumahan)\
      lat: Sequelize.STRING,
      lng: Sequelize.STRING,
      ditRususUsulanId: Sequelize.INTEGER,
      ditRusunUsulanId: Sequelize.INTEGER,
      ditRuswaUsulanId: Sequelize.INTEGER,
      ditRukUsulanId: Sequelize.INTEGER,
      DirektoratId: Sequelize.INTEGER,
      nik: Sequelize.STRING,
      UserId: Sequelize.INTEGER,
      email: Sequelize.STRING,
      statusTanah: Sequelize.STRING,
      luasTanah: Sequelize.STRING,
      PengembangId: Sequelize.INTEGER,
      PerusahaanId: Sequelize.INTEGER,
      PerumahanId: Sequelize.INTEGER,
      penerimaBantuan: Sequelize.STRING,
      PenerimaSpesifikId: Sequelize.INTEGER,
      MasterKegiatanId: Sequelize.INTEGER,
      type: Sequelize.INTEGER,
      ttdBupati: Sequelize.STRING,
      updatedBy: Sequelize.INTEGER,
      namaPerumahan: Sequelize.STRING,
      hargaRumah: Sequelize.INTEGER,
      jumlahUsulan: Sequelize.INTEGER,
      dayaTampung: Sequelize.INTEGER,
      tahunBantuanPsu: Sequelize.INTEGER,
      migratedFrom: Sequelize.STRING,
      // dari sibaru lama
      proposal_id: Sequelize.INTEGER,
      namaKomunitas: Sequelize.STRING,
      jenisData: Sequelize.STRING,
      jenisPerumahan: Sequelize.STRING,
      KroId: Sequelize.INTEGER,
      RoId: Sequelize.INTEGER,
      anggaran: Sequelize.BIGINT,
      uraian: Sequelize.TEXT,
      statusKonreg: Sequelize.STRING,
      konregResponse: Sequelize.TEXT,
      konregYear: Sequelize.INTEGER,
      sikonregData: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rumahTerbangun: Sequelize.TEXT,
      proporsiJml: Sequelize.TEXT,
      noSuratKeputusanDaerah: Sequelize.STRING,
      bentukBantuan: Sequelize.TEXT,
      besertaDrainase: Sequelize.BOOLEAN,
      namaKelompokMbr: Sequelize.STRING,
      luasanDelinasi: Sequelize.INTEGER,
      dimensiJalan: Sequelize.TEXT,
      koordinat: Sequelize.TEXT,
      statusJalan: Sequelize.STRING,
      detailStatus: Sequelize.STRING,
      dokumenSbu: Sequelize.TEXT,
      
      flagPortal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      prioritasJenis: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      prioritasRangkaianPemrograman: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      //relationships
      MasterKegiatan: {
        type: Sequelize.JSON,
        allowNull: true,
      },
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
      PenerimaManfaat: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      Direktorat: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      Perusahaan: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      Pengembang: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      User: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ProOutput: {
        //KroId
        type: Sequelize.JSON,
        allowNull: true,
      },
      ProSubOutput: {
        //RoId
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
    await queryInterface.dropTable('usulans')
  },
}
