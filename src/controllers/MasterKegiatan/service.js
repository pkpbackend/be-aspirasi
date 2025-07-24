import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class MasterKegiatanService {
  static async getById(id) {
    const response = await apiMaster.get(`masterkegiatan/${id}`)
    return response.data
  }
}

export default MasterKegiatanService
