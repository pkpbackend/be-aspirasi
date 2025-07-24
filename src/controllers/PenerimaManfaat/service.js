import { mkApiMaster } from '../../helpers/internalApi'

const apiMaster = mkApiMaster()

class PenerimaManfaatService {
  static async getPenerimaManfaatById(id) {
    const response = await apiMaster.get(`penerimamanfaat/${id}`)
    return response.data
  }
}

export default PenerimaManfaatService
