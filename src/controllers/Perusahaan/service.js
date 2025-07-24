import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class PerusahaanService {
  static async getPerusahaanById(id) {
    const response = await apiMaster.get(`perusahaan/${id}`)
    return response.data
  }
}

export default PerusahaanService
