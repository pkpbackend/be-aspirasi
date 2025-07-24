import { Model, DataTypes } from 'sequelize'
import db from './_instance'

class Sasaran extends Model {}

/** @type {import('sequelize').ModelAttributes<Sasaran, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },

  UsulanId: DataTypes.INTEGER,
  ProvinsiId: DataTypes.INTEGER,
  CityId: DataTypes.INTEGER,
  KecamatanId: DataTypes.INTEGER,
  DesaId: DataTypes.BIGINT,
  KecamatanLainnya: DataTypes.STRING,
  DesaLainnya: DataTypes.STRING,
  MasterKegiatanId: DataTypes.INTEGER,
  lat: DataTypes.STRING,
  lng: DataTypes.STRING,
  jumlahUnit: DataTypes.INTEGER,
  jumlahUnitPk: DataTypes.INTEGER,
  jumlahUnitPb: DataTypes.INTEGER,
  rtlh: DataTypes.TEXT,

  //relationships
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
}

Sasaran.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'Sasaran',
  tableName: 'sasarans',
})

export default Sasaran
