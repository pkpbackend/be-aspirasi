import { mkApiMaster } from '../../helpers/internalApi'

class ProSubOutputService {

  static async getById(id, accessTokenInternal) {
    const apiMasterWithAuth  = mkApiMaster(accessTokenInternal)
    const response = await apiMasterWithAuth.get(`prosuboutput/${id}`)
    return (response.data).data
  }

}

export default ProSubOutputService
