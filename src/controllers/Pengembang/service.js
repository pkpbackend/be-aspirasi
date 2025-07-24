import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class PengembangService {
  static async getById(id) {
    const response = await apiMaster.get(`pengembang/${id}`)
    return response.data
  }
}

export default PengembangService
