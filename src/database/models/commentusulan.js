import { Model, DataTypes } from 'sequelize'
import db from './_instance'

class CommentUsulan extends Model {}

/** @type {import('sequelize').ModelAttributes<CommentUsulan, import('sequelize').Optional<any, never>>} */
const attributes = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },

  message: DataTypes.TEXT,
  UsulanId: DataTypes.INTEGER,
  UserId: DataTypes.INTEGER,
  User: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}

CommentUsulan.init(attributes, {
  sequelize: db.sequelize,
  modelName: 'CommentUsulan',
  tableName: 'commentusulans',
})

export default CommentUsulan
