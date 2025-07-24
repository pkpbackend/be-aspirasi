import { Model, DataTypes } from 'sequelize'
import db from './_instance'

import Usulan from './usulan'

class KomponenPengajuan extends Model {}

/** @type {import('sequelize').ModelAttributes<KomponenPengajuan, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.BIGINT,
  },

  MasterKomponenPengajuanId: DataTypes.INTEGER,
  MasterKomponenPengajuan: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  UsulanId: DataTypes.BIGINT,
}

KomponenPengajuan.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'KomponenPengajuan',
  tableName: 'komponenpengajuans',
})

KomponenPengajuan.belongsTo(Usulan, {
  sourceKey: 'UsulanId',
})

export default KomponenPengajuan
