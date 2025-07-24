import ResponseError from '../../modules/Error'
import models from '../../database/models'

const { Sasaran } = models

class SasaranService {
  static async findByUsulanId(UsulanId) {
    if (!UsulanId) throw new ResponseError.BadRequest('UsulanId harus diisi')
    const data = await Sasaran.findAll({
      where: {
        UsulanId,
      },
    })
    return data
  }
}

export default SasaranService
