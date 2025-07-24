import { Model, DataTypes } from 'sequelize'
import db from './_instance'

// association
import Vermin from './vermin'
import Vertek from './vertek'
import CommentUsulan from './commentusulan'
import Sasaran from './sasaran'
import UsulanLokasi from './usulanlokasi'
import UsulanPerumahan from './usulanperumahan'

class Usulan extends Model {}

/** @type {import('sequelize').ModelAttributes<Usulan, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },

  // missing fields
  luasanDelinasi: DataTypes.INTEGER,
  statusJalan: DataTypes.STRING,
  detailStatus: DataTypes.STRING,
  besertaDrainase: DataTypes.BOOLEAN,

  // rusus
  PenerimaManfaatId: DataTypes.STRING,
  jumlahUnit: DataTypes.INTEGER,
  jumlahUnitPk: DataTypes.INTEGER,
  jumlahUnitPb: DataTypes.INTEGER,
  jumlahTb: DataTypes.INTEGER,
  keterangan: DataTypes.TEXT,
  tahunPengajuan: DataTypes.INTEGER,
  noUsulan: DataTypes.STRING,
  jenisData: DataTypes.STRING,
  jenisPerumahan: DataTypes.STRING,
  noSurat: DataTypes.STRING,
  tglSurat: DataTypes.DATE,
  kegiatan: DataTypes.TEXT,
  picPengusul: DataTypes.STRING,
  jabatanPic: DataTypes.STRING,
  direktif: DataTypes.BOOLEAN,
  statusVermin: DataTypes.INTEGER,
  statusVerminUpdatedAt: DataTypes.DATE,
  statusVerminId: DataTypes.INTEGER,
  statusPenetapan: DataTypes.INTEGER,
  statusPenetapanUpdatedAt: DataTypes.DATE,
  statusPenetapanId: DataTypes.INTEGER,
  SatkerId: DataTypes.INTEGER,
  statusTerkirim: DataTypes.STRING,
  skorTematik: DataTypes.VIRTUAL,
  totalSkor: DataTypes.VIRTUAL,
  reqVirtual: DataTypes.VIRTUAL,
  updatedBy: DataTypes.INTEGER,

  // VERTEK
  statusVertek: DataTypes.INTEGER,
  statusVertekUpdatedAt: DataTypes.DATE,
  statusVertekId: DataTypes.INTEGER,
  keteranganVertek: DataTypes.TEXT,

  // data - data pengusul
  pengusul: DataTypes.TEXT,
  email: DataTypes.STRING,
  telponPengusul: DataTypes.STRING,
  instansi: DataTypes.STRING,
  alamatInstansi: DataTypes.STRING,

  //rusun
  tahunProposal: DataTypes.STRING,
  kodeProposal: DataTypes.STRING,
  tglDisposisi: DataTypes.DATE,
  pemberiDisposisi: DataTypes.STRING,
  disposisi: DataTypes.STRING,
  nomorAgenda: DataTypes.STRING,
  usulanAspirasi: DataTypes.STRING,
  luasTanah: DataTypes.STRING,
  statusTanah: DataTypes.STRING,
  penerimaBantuan: DataTypes.STRING,

  // swadaya
  MasterKegiatanId: DataTypes.INTEGER,
  ttdBupati: DataTypes.STRING,

  // per instansi usulan id
  ditRususUsulanId: DataTypes.INTEGER,
  ditRusunUsulanId: DataTypes.INTEGER,
  ditRuswaUsulanId: DataTypes.INTEGER,
  ditRukUsulanId: DataTypes.INTEGER,

  // ruk
  type: DataTypes.INTEGER,
  namaKomunitas: DataTypes.STRING,
  namaPerumahan: DataTypes.STRING,
  hargaRumah: DataTypes.INTEGER,
  dayaTampung: DataTypes.INTEGER,
  jumlahUsulan: DataTypes.INTEGER,
  tahunBantuanPsu: DataTypes.INTEGER,
  dokumenSbu: {
    type: DataTypes.TEXT,
    get() {
      if (this.getDataValue('dokumenSbu')) {
        return JSON.parse(this.getDataValue('dokumenSbu'))
      }

      return []
    },
    set(val) {
      if (val) {
        this.setDataValue('dokumenSbu', JSON.stringify(val))
      } else {
        this.setDataValue('dokumenSbu', null)
      }
    },
  },
  rumahTerbangun: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('rumahTerbangun')
      try {
        if (val) return JSON.parse(val)
      } catch (err) {
        return val
      }
      return null
    },
    set(val) {
      try {
        if (typeof val === 'string') this.setDataValue('rumahTerbangun', val)
        else if (val) this.setDataValue('rumahTerbangun', JSON.stringify(val))
        else this.setDataValue('rumahTerbangun', null)
      } catch (err) {
        this.setDataValue('rumahTerbangun', val)
      }
    },
  },
  proporsiJml: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('proporsiJml')
      try {
        if (val) return JSON.parse(val)
      } catch (err) {
        return val
      }
      return null
    },
    set(val) {
      try {
        if (typeof val === 'string') this.setDataValue('proporsiJml', val)
        else if (val) this.setDataValue('proporsiJml', JSON.stringify(val))
        else this.setDataValue('proporsiJml', null)
      } catch (err) {
        this.setDataValue('proporsiJml', val)
      }
    },
  },
  bentukBantuan: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('bentukBantuan')
      try {
        if (val) return JSON.parse(val)
      } catch (err) {
        return val
      }
      return null
    },
    set(val) {
      try {
        if (typeof val === 'string') this.setDataValue('bentukBantuan', val)
        else if (val) this.setDataValue('bentukBantuan', JSON.stringify(val))
        else this.setDataValue('bentukBantuan', null)
      } catch (err) {
        this.setDataValue('bentukBantuan', val)
      }
    },
  },
  dimensiJalan: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('dimensiJalan')
      try {
        if (val) return JSON.parse(val)
      } catch (err) {
        return val
      }
      return null
    },
    set(val) {
      try {
        if (typeof val === 'string') this.setDataValue('dimensiJalan', val)
        else if (val) this.setDataValue('dimensiJalan', JSON.stringify(val))
        else this.setDataValue('dimensiJalan', null)
      } catch (err) {
        this.setDataValue('dimensiJalan', val)
      }
    },
  },

  // universal
  lat: DataTypes.STRING,
  lng: DataTypes.STRING,

  ProvinsiId: DataTypes.INTEGER,
  CityId: DataTypes.INTEGER,
  DesaId: DataTypes.BIGINT,
  KecamatanId: DataTypes.INTEGER,
  
  DirektoratId: DataTypes.INTEGER,
  alamatLokasi: DataTypes.STRING, // di pake sama rusun(default), ruk(lokasiPerumahan)\
  PerumahanId: DataTypes.INTEGER,
  PerusahaanId: DataTypes.INTEGER,
  PengembangId: DataTypes.INTEGER,
  nik: DataTypes.STRING,
  UserId: DataTypes.INTEGER,
  PenerimaSpesifikId: DataTypes.INTEGER,

  // dari sibaru lama
  proposal_id: DataTypes.INTEGER,

  // konreg
  sipRoId: DataTypes.STRING,
  KroId: DataTypes.INTEGER,
  RoId: DataTypes.INTEGER,
  anggaran: DataTypes.BIGINT,
  uraian: DataTypes.TEXT,
  statusKonreg: DataTypes.STRING,
  konregResponse: DataTypes.TEXT,
  konregYear: DataTypes.INTEGER,
  sikonregData: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      if (this.getDataValue('sikonregData'))
        return JSON.parse(this.getDataValue('sikonregData'))
      else return null
    },
    set(value) {
      if (value) this.setDataValue('sikonregData', JSON.stringify(value))
      else this.setDataValue('sikonregData', null)
    },
  },
  noSuratKeputusanDaerah: DataTypes.STRING,
  namaKelompokMbr: DataTypes.STRING,
  flagPortal: DataTypes.BOOLEAN,

  //relationships
  User: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Provinsi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  City: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Kecamatan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Desa: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  PenerimaManfaat: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Direktorat: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  Perusahaan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ProOutput: {
    //KroId
    type: DataTypes.JSON,
    allowNull: true,
  },
  ProSubOutput: {
    //RoId
    type: DataTypes.JSON,
    allowNull: true,
  },
}

Usulan.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'Usulan',
  tableName: 'usulans',
})

// Association
Usulan.hasMany(Sasaran)
Usulan.hasMany(UsulanLokasi)
Usulan.hasMany(UsulanPerumahan)
Usulan.hasMany(CommentUsulan)

Usulan.hasOne(Vermin)
Usulan.hasOne(Vertek)

export default Usulan
