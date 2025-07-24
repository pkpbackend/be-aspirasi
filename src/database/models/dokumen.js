import { Model, DataTypes } from 'sequelize'
import db from './_instance'

class Dokumen extends Model {}

/** @type {import('sequelize').ModelAttributes<Dokumen, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  file: DataTypes.STRING,
  status: DataTypes.INTEGER,
  lengkap: DataTypes.INTEGER,
  model: DataTypes.STRING,
  ModelId: DataTypes.INTEGER,
  MasterDokumenId: DataTypes.INTEGER,
  keterangan: DataTypes.TEXT,
  valueText: DataTypes.STRING,

  ditRususDokumenId: DataTypes.INTEGER,
  ditRusunDokumenId: DataTypes.INTEGER,
  ditRuwaDokumenId: DataTypes.INTEGER,
  ditRukDokumenId: DataTypes.INTEGER,

  ditRususVerminId: DataTypes.INTEGER,

  PxMasterId: DataTypes.INTEGER,

  //relationships
  MasterDokumen: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}

Dokumen.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'Dokumen',
  tableName: 'dokumens',
})

export default Dokumen
