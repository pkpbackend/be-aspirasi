import { Model, DataTypes } from 'sequelize'
import db from './_instance'

import Usulan from './usulan'

class Tematik extends Model {}

/** @type {import('sequelize').ModelAttributes<Tematik, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.BIGINT,
  },

  MasterTematikId: DataTypes.INTEGER,
  MasterTematik: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  UsulanId: DataTypes.BIGINT,
}

Tematik.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'Tematik',
  tableName: 'tematiks',
})

Tematik.belongsTo(Usulan, {
  sourceKey: 'UsulanId',
})

export default Tematik
