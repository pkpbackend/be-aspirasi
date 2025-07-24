import { mkApiMaster } from '../../helpers/internalApi'

class ProOutputService {

  static async getById(id, accessTokenInternal) {
    const apiMasterWithAuth  = mkApiMaster(accessTokenInternal)
    const response = await apiMasterWithAuth.get(`prooutput/${id}`)
    return (response.data).data
  }

}

export default ProOutputService
