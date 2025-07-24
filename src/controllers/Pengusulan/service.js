import { mkApiPengusulan } from '../../helpers/internalApi'

class PengusulanService {

  static async cloneUsulan({
    usulan,
    vermins,
    verteks,
    sasarans,
    usulanLokasis,
    usulanPerumahans,
    komponenPengajuans,
    tematiks,
    dokumens,
  }, accessTokenInternal) {
    try {
      const apiPengusulan = mkApiPengusulan(accessTokenInternal)
      const response = await apiPengusulan.post('/usulan/clone', {
        usulan,
        vermins,
        verteks,
        sasarans,
        usulanLokasis,
        usulanPerumahans,
        komponenPengajuans,
        tematiks,
        dokumens,
      })
      
      return response.data
    }
    catch (error) {
      throw new ResponseError.NotFound('Gagal memindahkan usulan Aspirasi ke usulan utama')
    }
  }

}

export default PengusulanService
