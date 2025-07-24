import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class MasterKomponenPengajuanService {
  static async getById(id) {
    const response = await apiMaster.get(`master-komponen-pengajuan/${id}`)
    return response.data
  }
}

export default MasterKomponenPengajuanService
