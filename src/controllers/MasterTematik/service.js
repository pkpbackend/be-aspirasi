import ResponseError from '../../modules/Error'
import { mkApiMaster } from '../../helpers/internalApi'

class MasterTematikService {
  
  static async getById(id, accessTokenInternal) {
    try {
      const apiMasterWithAuth  = mkApiMaster(accessTokenInternal)
      const response = await apiMasterWithAuth.get(`mastertematik/${id}`)
      return response.data
    }
    catch {
      throw new ResponseError.NotFound('Gagal mendapatkan data Tematik')
    }
  }
  
}

export default MasterTematikService
