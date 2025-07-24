import { Model, DataTypes } from 'sequelize'
import db from './_instance'

// association
// import Usulan from './usulan'

class UsulanLokasi extends Model {}

/** @type {import('sequelize').ModelAttributes<UsulanLokasi, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },

  UsulanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  KecamatanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  DesaId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desaLainnya: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}

UsulanLokasi.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'UsulanLokasi',
  tableName: 'usulanlokasis',
})

// Association
// UsulanLokasi.belongsTo(Usulan)

export default UsulanLokasi
