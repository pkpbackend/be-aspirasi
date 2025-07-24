import { Model, DataTypes } from 'sequelize'
import db from './_instance'

// association
// import Usulan from './usulan'

class UsulanPerumahan extends Model {}

/** @type {import('sequelize').ModelAttributes<UsulanPerumahan, import('sequelize').Optional<any, never>>} */
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
  namaPerumahan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jmlRumahUmum: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presentaseRumahUmum: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jmlRumahMenengah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presentaseRumahMenengah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jmlRumahMewah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presentaseRumahMewah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}

UsulanPerumahan.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'UsulanPerumahan',
  tableName: 'usulanperumahans',
})

// Association
// UsulanPerumahan.belongsTo(Usulan)

export default UsulanPerumahan
