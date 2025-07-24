import { mkApiMaster } from '../../helpers/internalApi'

class MasterDokumenService {

  static async getById(id, accessTokenInternal) {
    const apiMasterWithAuth  = mkApiMaster(accessTokenInternal)
    const response = await apiMasterWithAuth.get(`masterdokumen/${id}`)
    return response.data
  }

  static async getAllByDirektoratIdAndModel(DirektoratId, model, accessTokenInternal) {
    const apiMasterWithAuth  = mkApiMaster(accessTokenInternal)

    const response = await apiMasterWithAuth.get(
      'masterdokumen/all', {
        params: {
          DirektoratId, 
          model,
        }
      }
    )

    return response.data
  }

}

export default MasterDokumenService
