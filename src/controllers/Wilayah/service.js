import Sasaran from '../../database/models/sasaran'
import RedisProvider from '../../helpers/Redis'
import { mkApiMaster } from '../../helpers/internalApi'
import Usulan from '../../database/models/usulan'
import sequelize, { Op } from 'sequelize'
import _ from 'lodash'

const apiMaster = mkApiMaster()

const Redis = new RedisProvider()

class WilayahService {
  static async getProvinsi(params = {}) {
    const response = await apiMaster.get('wilayah/provinsi', {
      params: params,
    })
    return response.data
  }
  static async getAllCity(body) {
    const response = await apiMaster.post('/wilayah/get-city', body)
    return response.data
  }

  static async getAllKecamatan(body) {
    const response = await apiMaster.post('/wilayah/get-kecamatan', body)
    return response.data
  }

  static async getAllDesa(body) {
    const response = await apiMaster.post('/wilayah/get-desa', body)
    return response.data
  }
  static async getProvinsiById(id) {
    const response = await apiMaster.get(`wilayah/provinsi/${id}`)
    return response.data
  }

  static async getCityById(id) {
    const response = await apiMaster.get(`wilayah/city/${id}`)
    return response.data
  }

  static async getKecamatanById(id) {
    const response = await apiMaster.get(`wilayah/kecamatan/${id}`)
    return response.data
  }

  static async getDesaById(id) {
    const response = await apiMaster.get(`wilayah/desa/${id}`)
    return response.data
  }

  static async getWilayahById(wilayah) {
    let response = {
      Provinsi: null,
      City: null,
      Kecamatan: null,
      Desa: null,
    }

    if (wilayah.provinsiId != null) {
      response = {
        ...response,
        Provinsi: await this.getProvinsiById(wilayah.provinsiId),
      }
    }

    if (wilayah.cityId != null) {
      response = {
        ...response,
        City: await this.getCityById(wilayah.cityId),
      }
    }

    if (wilayah.kecamatanId != null) {
      response = {
        ...response,
        Kecamatan: await this.getKecamatanById(wilayah.kecamatanId),
      }
    }

    if (wilayah.desaId != null) {
      response = {
        ...response,
        Desa: await this.getDesaById(wilayah.desaId),
      }
    }

    return response
  }

  static async syncWilayah() {
    //sasaran : provinsi, city, kecamatan, desa
    //usulan : provinsi, city, kecamatan, desa

    const isSyncActive = await Redis.get('syncWilayahAspirasi')
    if (isSyncActive === 'true' || isSyncActive === true) {
      console.log('sync wilayah is already active')
      return {
        message: 'sync wilayah is already active',
      }
    }

    await Redis.set('syncWilayahAspirasi', true)

    let provinsiIds = []
    let cityIds = []
    let kecamatanIds = []
    let desaIds = []

    //sasaran
    const sasaran = await Sasaran.findAll({
      where: {
        [Op.or]: [
          { ProvinsiId: { [Op.ne]: null } },
          { CityId: { [Op.ne]: null } },
          { KecamatanId: { [Op.ne]: null } },
          { DesaId: { [Op.ne]: null } },
        ],
      },
    })

    sasaran.forEach((v) => {
      if (v.ProvinsiId != null) {
        provinsiIds.push(v.ProvinsiId)
      }

      if (v.CityId != null) {
        cityIds.push(v.CityId)
      }

      if (v.KecamatanId != null) {
        kecamatanIds.push(v.KecamatanId)
      }

      if (v.DesaId != null) {
        desaIds.push(v.DesaId)
      }
    })

    //usulan
    const usulan = await Usulan.findAll({
      where: {
        [Op.or]: [
          { ProvinsiId: { [Op.ne]: null } },
          { CityId: { [Op.ne]: null } },
          { KecamatanId: { [Op.ne]: null } },
          { DesaId: { [Op.ne]: null } },
        ],
      },
    })

    usulan.forEach((v) => {
      if (v.ProvinsiId != null) {
        provinsiIds.push(v.ProvinsiId)
      }

      if (v.CityId != null) {
        cityIds.push(v.CityId)
      }

      if (v.KecamatanId != null) {
        kecamatanIds.push(v.KecamatanId)
      }

      if (v.DesaId != null) {
        desaIds.push(v.DesaId)
      }
    })

    //remove duplicate
    provinsiIds = [...new Set(provinsiIds)]
    cityIds = [...new Set(cityIds)]
    kecamatanIds = [...new Set(kecamatanIds)]
    desaIds = [...new Set(desaIds)]

    desaIds = _.chunk(desaIds, 5000)

    //get data wilayah
    const provinsis = await this.getProvinsi({
      filtered: JSON.stringify([
        {
          id: 'in$id',
          value: provinsiIds,
        },
      ]),
      pageSize: provinsiIds.length,
    })

    const citys = await this.getAllCity({
      ids: cityIds,
    })

    const kecamatans = await this.getAllKecamatan({
      ids: kecamatanIds,
    })

    let desas = []

    for (let i = 0; i < desaIds.length; i++) {
      desas[i] = await this.getAllDesa({
        ids: desaIds[i],
      })
    }

    sasaran.forEach((v) => {
      if (v.ProvinsiId != null) {
        v.Provinsi = provinsis.data.find((x) => x.id == v.ProvinsiId)
      }

      if (v.CityId != null) {
        v.City = citys.data.find((x) => x.id == v.CityId)
      }

      if (v.KecamatanId != null) {
        v.Kecamatan = kecamatans.data.find((x) => x.id == v.KecamatanId)
      }

      if (v.DesaId != null) {
        for (let i = 0; i < desas.length; i++) {
          if (desas[i].data.find((x) => x.id == v.DesaId)) {
            v.Desa = desas[i].data.find((x) => x.id == v.DesaId)
            break
          }
        }
      }

      v.save()
    })

    usulan.forEach((v) => {
      if (v.ProvinsiId != null) {
        v.Provinsi = provinsis.data.find((x) => x.id == v.ProvinsiId)
      }

      if (v.CityId != null) {
        v.City = citys.data.find((x) => x.id == v.CityId)
      }

      if (v.KecamatanId != null) {
        v.Kecamatan = kecamatans.data.find((x) => x.id == v.KecamatanId)
      }

      if (v.DesaId != null) {
        for (let i = 0; i < desas.length; i++) {
          if (desas[i].data.find((x) => x.id == v.DesaId)) {
            v.Desa = desas[i].data.find((x) => x.id == v.DesaId)
            break
          }
        }
      }

      v.save()
    })

    await Redis.setEx('syncWilayahAspirasi', true, 10)

    return {
      message: 'success',
    }
  }
}

export default WilayahService
