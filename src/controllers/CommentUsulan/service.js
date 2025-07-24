import ResponseError from '../../modules/Error'
import models from '../../database/models'

const { Usulan, CommentUsulan } = models

class CommentUsulanService {
  static async create({
    message,
    UsulanId,
    UserId,
    User,
  }) {
    if (!message) throw new ResponseError.BadRequest('Message belum diisi')
    if (!UsulanId) throw new ResponseError.BadRequest('UsulanId diperlukan')

    const usulan = await Usulan.findByPk(UsulanId)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    const data = await CommentUsulan.create({
      message,
      UsulanId,
      UserId,
      User,
    })

    return data
  }
}

export default CommentUsulanService
