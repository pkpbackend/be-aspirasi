import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class DirektoratService {
  static async getDirektoratById(id) {
    const response = await apiMaster.get(`direktorat/${id}`)
    return response.data
  }
}

export default DirektoratService
