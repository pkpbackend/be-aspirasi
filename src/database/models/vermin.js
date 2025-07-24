import { Model, DataTypes } from 'sequelize'
import db from './_instance'

// association
import Dokumen from './dokumen'

class Vermin extends Model {}

/** @type {import('sequelize').ModelAttributes<Vermin, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },

  status: DataTypes.INTEGER,
  keterangan: DataTypes.TEXT,
  UsulanId: DataTypes.INTEGER,
  ditRususVerminId: DataTypes.BIGINT,
  suratPermohonan: DataTypes.BOOLEAN,
  proposal: DataTypes.BOOLEAN,
  fcSertifikatTanah: DataTypes.BOOLEAN,
  suratPermohonanKet: DataTypes.STRING,
  proposalKet: DataTypes.STRING,
  fcSertifikatTanahKet: DataTypes.STRING,
  statusTanah: DataTypes.STRING,
  statusTanahKet: DataTypes.STRING,
  luasTanah: DataTypes.STRING,
  catatan: DataTypes.STRING,

  reqVirtual: DataTypes.VIRTUAL,
}

Vermin.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'Vermin',
  tableName: 'vermins',
})

Vermin.hasMany(Dokumen, {foreignKey: 'ModelId', sourceKey: 'id'})

export default Vermin
