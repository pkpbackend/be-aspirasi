import fs from 'fs'
import excel from 'exceljs'
import { mkApiMaster } from '../../helpers/internalApi'
import { uploadFileToS3, removeS3File } from '../../helpers/s3Helper'
import ResponseError from '../../modules/Error'
import PluginSqlizeQuery from '../../modules/SqlizeQuery/PluginSqlizeQuery'
import models from '../../database/models'
import WilayahService from '../../controllers/Wilayah/service'
// import PluginSqlizeQuery from '../../modules/SqlizeQuery/PluginSqlizeQuery'
import { JENIS_DATA_USULAN, PREFIX_NO_USULAN } from '../../constants/Usulan'
import _ from 'lodash'
import PenerimaManfaatService from '../../controllers/PenerimaManfaat/service'
import PerusahaanService from '../../controllers/Perusahaan/service'
import DirektoratService from '../../controllers/Direktorat/service'
import MasterKomponenPengajuanService from '../../controllers/MasterKomponenPengajuan/service'
import MasterDokumenService from '../../controllers/MasterDokumen/service'
import { EMPTY_ARRAY } from '../../constants/ConstType'
import {
  convertQueryCondition,
  convertQueryFilter,
} from '../../helpers/ConvertQuery'
import Sequelize, { Op, literal } from 'sequelize'
import MasterKegiatanService from '../../controllers/MasterKegiatan/service'
import PengembangService from '../../controllers/Pengembang/service'

const {
  Usulan,
  Sasaran,
  Vermin,
  UsulanLokasi,
  UsulanPerumahan,
  KomponenPengajuan,
  Vertek,
  Dokumen,
  CommentUsulan,
} = models

class UsulanService {
  static filterIncludeJson = (filtered = '[]', keys = []) => {
    const where = {}
    if (filtered) {
      _.forEach(keys, (key) => {
        if (filtered.includes(key)) {
          const parsedFilter = JSON.parse(filtered)
          const searchValue = parsedFilter.find((item) => item.id.includes(key))
          if (!_.isEmpty(searchValue)) {
            where[key] = {
              [Op.or]: searchValue.value
                .split(',')
                .map((v) => literal(`JSON_CONTAINS(${key}, '${v}', '$')`)),
            }
          }
        }
      })
    }

    return where
  }

  static async findAllPaginate(req, userLogin) {
    let { lang, sorted, filtered, attributes } = req.getQuery()

    if (sorted) {
      const parsedSorted = JSON.parse(sorted)
      const indexPrioritasNilai = _.findIndex(
        parsedSorted,
        (item) => item.id === 'prioritasNilai'
      )
      if (indexPrioritasNilai !== -1) {
        parsedSorted[indexPrioritasNilai].id = 'totalNilaiPrioritas'
      }
      req.query.sorted = JSON.stringify(parsedSorted)
    }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Usulan,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, [])
    )

    if (filtered) {
      const parsedFilter = JSON.parse(filtered)

      // tahunSuratUsulan
      const indexTahunSurat = _.findIndex(
        parsedFilter,
        (item) => item.id === 'tahunSuratUsulan'
      )
      let tahunSuratUsulan = _.find(
        parsedFilter,
        (item) => item.id === 'tahunSuratUsulan'
      )
      if (Array.isArray(parsedFilter) && indexTahunSurat !== -1)
        parsedFilter.splice(indexTahunSurat, 1)

      //tahunUsulan
      const indexTahun = _.findIndex(
        parsedFilter,
        (item) => item.id === 'tahunUsulan'
      )
      let tahunUsulan = _.find(
        parsedFilter,
        (item) => item.id === 'tahunUsulan'
      )
      if (Array.isArray(parsedFilter) && indexTahun !== -1)
        parsedFilter.splice(indexTahun, 1)

      // filter by logged in admin direktorat role
      if (userLogin.RoleId) {
        const adminDirektoratRoleId = [24, 25, 27, 28]
        if (adminDirektoratRoleId.includes(userLogin.RoleId)) {
          const indexDirektoratId = _.findIndex(
            parsedFilter,
            (item) => item.id === 'DirektoratId'
          )
          if (Array.isArray(parsedFilter) && indexDirektoratId !== -1)
            parsedFilter.splice(indexDirektoratId, 1)

          queryFind.where = {
            ...queryFind.where,
            DirektoratId: userLogin.Role.DirektoratId,
          }
        }
      }

      filtered = JSON.stringify(parsedFilter)

      if (tahunSuratUsulan) {
        queryFind.where = {
          ...queryFind.where,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tglSurat')), {
              [Op.eq]: tahunSuratUsulan.value,
            }),
          ],
        }

        delete queryFind.where.tahunSuratUsulan
      }

      if (tahunUsulan) {
        queryFind.where = {
          ...queryFind.where,
          [Op.or]: [
            {
              tahunProposal: {
                [Op.eq]: tahunUsulan.value,
              },
            },
            {
              tahunBantuanPsu: {
                [Op.eq]: tahunUsulan.value,
              },
            },
          ],
        }

        delete queryFind.where.tahunUsulan
      }
    }

    if (queryFind.where.status) {
      const status = queryFind.where.status
      switch (status[Op.like]) {
        case '%vermin%':
          queryFind.where = {
            ...queryFind.where,
            statusVermin: 1,
            statusVertek: null,
          }
          break
        case '%vertek%':
          queryFind.where = {
            ...queryFind.where,
            statusVermin: 1,
            statusVertek: 1,
          }
          break
        case '%penetapan%':
          queryFind.where = {
            ...queryFind.where,
            statusVermin: 1,
            statusVertek: 1,
          }
          break
        case '%serah-terima%':
          queryFind.where = {
            ...queryFind.where,
            statusVermin: 1,
            statusVertek: 1,
          }
      }
      delete queryFind.where.status
    }

    queryFind.where = {
      ...queryFind.where,
      ...this.filterIncludeJson(filtered, [
        'prioritasJenis',
        'prioritasRangkaianPemrograman',
      ]),
    }

    const data = await Usulan.findAndCountAll({
      ...queryFind,
      attributes,
      order: order.length ? order : [['createdAt', 'DESC']],
      logging: console.log,
    })

    const count = data.count

    return {
      data: data.rows,
      message: 'success',
      totalRow: count,
      page: queryFind.offset / queryFind.limit + 1,
      pageSize: queryFind.limit,
      pages: Math.ceil(count / queryFind.limit),
    }
  }

  static async findPaginate(page, pageSize, query) {
    pageSize = isNaN(pageSize) ? 10 : parseInt(pageSize)
    page = isNaN(page) ? 1 : parseInt(page)
    let offset = pageSize * (page - 1)

    let { filtered, condition, sorted } = query

    let getFilter = {}
    let getCondition = {}

    //parse filter
    filtered = EMPTY_ARRAY.indexOf(filtered) === -1 ? JSON.parse(filtered) : {}

    //remove index tahun surat
    const indexTahunSurat = _.findIndex(
      filtered,
      (item) => item.id === 'tahunSurat'
    )
    let tahunSuratUsulan = _.find(filtered, (item) => item.id === 'tahunSurat')
    if (Array.isArray(filtered) && indexTahunSurat !== -1)
      filtered.splice(indexTahunSurat, 1)

    //remove index tahun
    const indexTahun = _.findIndex(
      filtered,
      (item) => item.id === 'tahunUsulan'
    )
    let tahunUsulan = _.find(filtered, (item) => item.id === 'tahunUsulan')
    if (Array.isArray(filtered) && indexTahun !== -1)
      filtered.splice(indexTahun, 1)

    //remove sipro pool
    const indexSipro = _.findIndex(filtered, (item) => item.id === 'siproPool')
    let sipro = _.find(filtered, (item) => item.id === 'siproPool')
    if (Array.isArray(filtered) && indexSipro !== -1)
      filtered.splice(indexSipro, 1)

    getFilter = convertQueryFilter(filtered)
    console.log(getFilter)

    //add filter
    if (tahunSuratUsulan) {
      getFilter = {
        ...getFilter,
        [Op.and]: [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('tglSurat')), {
            [Op.eq]: tahunSuratUsulan.value,
          }),
        ],
      }
    }

    if (tahunUsulan) {
      getFilter = {
        ...getFilter,
        [Op.or]: [
          {
            tahunProposal: {
              [Op.eq]: tahunUsulan.value,
            },
          },
          {
            tahunBantuanPsu: {
              [Op.eq]: tahunUsulan.value,
            },
          },
        ],
      }
    }

    if (sipro) {
      if (sipro.value == 'belum') {
        getFilter = {
          ...getFilter,
          [Op.and]: [
            {
              sipRoId: null,
            },
            {
              uraian: null,
            },
            {
              anggaran: null,
            },
            {
              KroId: null,
            },
            {
              statusVermin: 1,
            },
          ],
        }
      } else if (sipro.value == 'pool') {
        getFilter = {
          ...getFilter,
          [Op.and]: [
            {
              sipRoId: null,
            },
            {
              uraian: {
                [Op.ne]: null,
              },
            },
            {
              anggaran: {
                [Op.ne]: null,
              },
            },
            {
              KroId: {
                [Op.ne]: null,
              },
            },
            {
              statusVermin: 1,
            },
          ],
        }
      } else if (sipro.value == 'sync') {
        getFilter = {
          ...getFilter,
          [Op.and]: [
            {
              sipRoId: {
                [Op.ne]: null,
              },
            },
            {
              uraian: {
                [Op.ne]: null,
              },
            },
            {
              anggaran: {
                [Op.ne]: null,
              },
            },
            {
              KroId: {
                [Op.ne]: null,
              },
            },
            {
              statusVermin: 1,
            },
          ],
        }
      }
    }

    // getFilter = {
    //   ...getFilter,
    //   [Op.and]: [
    //     {
    //       statusTerkirim: {
    //         [Op.ne]: 'dipindahkan',
    //       },
    //     },
    //   ],
    // }

    //parse condition
    condition =
      EMPTY_ARRAY.indexOf(condition) === -1 ? JSON.parse(condition) : {}
    getCondition = convertQueryCondition(condition)

    if (getCondition.notStatusTerkirim) {
      getCondition.statusTerkirim = { [Op.ne]: getCondition.notStatusTerkirim }
      delete getCondition.notStatusTerkirim
    }

    getCondition = {
      ..._.omit(getCondition, ['tahunUsulan']),
    }

    // Sorting
    const sortArr = EMPTY_ARRAY.indexOf(sorted) === -1 ? JSON.parse(sorted) : {}
    let ordering = []
    for (let i = 0; i < sortArr.length; i++) {
      // nested
      let sort = sortArr[i].id
      let sortSplit = sort.split('.')
      let sortPush = [sortArr[i].id, sortArr[i].desc ? 'DESC' : 'ASC']
      if (sortSplit.length > 1) {
        sortPush = [
          sortSplit[0],
          sortSplit[1],
          sortArr[i].desc ? 'DESC' : 'ASC',
        ]
      }

      ordering.push(sortPush)
    }

    console.log({
      ...getFilter,
      ...getCondition,
    })

    const data = await Usulan.findAndCountAll({
      where: {
        ...getFilter,
        ...getCondition,
      },
      limit: pageSize,
      offset,
      order: ordering,
    })

    let usulans = []
    for (const usulan of data.rows) {
      usulans.push({
        ...usulan.dataValues,
        prioritas: usulan.dataValues.prioritas
          ? JSON.parse(usulan.dataValues.prioritas)
          : {},
      })
    }

    return {
      data: data.rows,
      message: 'success',
      page,
      pageSize,
      pages: Math.ceil(Number(data.count) / Number(pageSize)),
      totalRow: data.count,
    }
  }

  static async findById(id) {
    const data = await Usulan.findOne({
      where: { id },
      include: [
        { model: Sasaran },
        { model: UsulanLokasi },
        { model: UsulanPerumahan },
        { model: CommentUsulan },
      ],
    })
    if (!data) throw new ResponseError.NotFound('Usulan tidak ditemukan')
    return data
  }

  static async createPerusahaan(data, accessTokenInternal) {
    const apiMasterWithAuth = mkApiMaster(accessTokenInternal)
    const response = await apiMasterWithAuth.post('perusahaan', data)
    return response.data
  }

  static async create(data, { id, nama, username, email }) {
    const insertData = await this.usulanTransform(data)

    const usulan = await Usulan.create({
      ...insertData,
      UserId: id,
      User: {
        id,
        fullName: nama,
        username,
        email,
        phone: null,
      },
      dokumenSbu: data.dokumenSbu,
      statusTerkirim: 'belum terkirim',
    })

    usulan.noUsulan = `${PREFIX_NO_USULAN[insertData.DirektoratId]}-${
      insertData.jenisData
    }-A${usulan.id}`
    await usulan.save()

    await Vermin.create({ UsulanId: usulan.id })

    let sasarans = data.sasarans
    if (Array.isArray(sasarans) && sasarans.length > 0) {
      sasarans = await Promise.all(
        sasarans.map(async (item) => ({
          ...(await this.sasaranTransform(item)),
          UsulanId: usulan.id,
        }))
      )
      sasarans = await Sasaran.bulkCreate(sasarans, { return: true })
    }

    if (data.UsulanLokasi) {
      let usulanLokasis = Array.isArray(data.UsulanLokasi)
        ? data.UsulanLokasi
        : JSON.parse(data.UsulanLokasi)
      if (Array.isArray(usulanLokasis) && usulanLokasis.length > 0) {
        usulanLokasis = await Promise.all(
          usulanLokasis.map(async (item) => ({
            ...item,
            UsulanId: usulan.id,
          }))
        )
        await UsulanLokasi.bulkCreate(usulanLokasis, { return: true })
      }
    }

    if (data.UsulanPerumahan) {
      let usulanPerumahans = Array.isArray(data.UsulanPerumahan)
        ? data.UsulanPerumahan
        : JSON.parse(data.UsulanPerumahan)
      if (Array.isArray(usulanPerumahans) && usulanPerumahans.length > 0) {
        usulanPerumahans = await Promise.all(
          usulanPerumahans.map(async (item) => ({
            ...item,
            UsulanId: usulan.id,
          }))
        )
        await UsulanPerumahan.bulkCreate(usulanPerumahans, { return: true })
      }
    }

    if (data.komponenPengajuan) {
      if (
        typeof data.komponenPengajuan === 'object' &&
        data.komponenPengajuan.length > 0
      ) {
        const pengajuanStore = []
        data.komponenPengajuan.forEach(async (item) => {
          const mkp = await MasterKomponenPengajuanService.getById(item)
          return pengajuanStore.push({
            UsulanId: usulan.id,
            MasterKomponenPengajuanId: item,
            MasterKomponenPengajuan: mkp,
          })
        })

        await KomponenPengajuan.bulkCreate(pengajuanStore)
      }
    }

    return usulan
  }

  static async sasaranTransform(data) {
    const wilayah = await WilayahService.getWilayahById({
      provinsiId: data.ProvinsiId ?? null,
      cityId: data.CityId ?? null,
      kecamatanId: data.KecamatanId ?? null,
      desaId: data.DesaId ?? null,
    })
    return {
      ...data,
      Provinsi: wilayah.Provinsi,
      City: wilayah.City,
      Kecamatan: wilayah.Kecamatan,
      Desa: wilayah.Desa,
    }
  }

  static async usulanTransform(data) {
    let transformedData = {}

    if (data.DirektoratId === 1) {
      const jenisData = _.find(JENIS_DATA_USULAN.non_ruk, (o) => {
        return o.value === data.jenisData
      })

      //rusun
      transformedData = {
        nik: data.nik,
        prioritasJenis: [jenisData.keyPrioritas],
        DirektoratId: data.DirektoratId,
        jenisData: data.jenisData,
        tahunProposal: data.tahunUsulan,
        direktif: jenisData.jenis === 'direktif' ? true : false,
        noSurat: data.noSurat,
        tglSurat: data.tanggalSurat,

        telponPengusul: data.telpPicPengusul,
        email: data.emailPicPengusul,
        jabatanPic: data.jabatanPicPengusul,
        picPengusul: data.namaPicPengusul,

        instansi: data.instansi,
        alamatInstansi: data.alamatInstansi,

        lat: data.latitude,
        lng: data.longitude,

        ProvinsiId: data.ProvinsiId,
        CityId: data.CityId,
        KecamatanId: data.KecamatanId,
        DesaId: data.DesaId,

        jumlahTb: data.jumlahTower,
        jumlahUnit: data.jumlahUnit,

        PenerimaManfaatId: data.PenerimaManfaatId,
      }
    } else if (data.DirektoratId === 2) {
      const jenisData = _.find(JENIS_DATA_USULAN.non_ruk, (o) => {
        return o.value === data.jenisData
      })

      //rusus
      transformedData = {
        nik: data.nik,
        prioritasJenis: [jenisData.keyPrioritas],
        DirektoratId: data.DirektoratId,
        jenisData: data.jenisData,
        direktif: jenisData.jenis === 'direktif' ? true : false,
        noSurat: data.noSurat,
        tglSurat: data.tanggalSurat,

        telponPengusul: data.telpPicPengusul,
        email: data.emailPicPengusul,
        jabatanPic: data.jabatanPicPengusul,
        picPengusul: data.namaPicPengusul,

        instansi: data.instansi,
        alamatInstansi: data.alamatInstansi,

        ProvinsiId: data.ProvinsiId,
        CityId: data.CityId,

        jumlahUnit: data.jumlahUnit,

        PenerimaManfaatId: data.PenerimaManfaatId,

        lat: data.latitude,
        lng: data.longitude,

        keterangan: data.keterangan,
      }
    } else if (data.DirektoratId === 3) {
      const jenisData = _.find(JENIS_DATA_USULAN.non_ruk, (o) => {
        return o.value === data.jenisData
      })

      //swadaya
      transformedData = {
        nik: data.nik,
        prioritasJenis: [jenisData.keyPrioritas],
        DirektoratId: data.DirektoratId,
        tahunProposal: data.tahunUsulan,
        jenisData: data.jenisData,
        direktif: jenisData.jenis === 'direktif' ? true : false,
        noSurat: data.noSurat,
        tglSurat: data.tanggalSurat,

        telponPengusul: data.telpPicPengusul,
        email: data.emailPicPengusul,
        jabatanPic: data.jabatanPicPengusul,
        picPengusul: data.namaPicPengusul,

        instansi: data.instansi,
        alamatInstansi: data.alamatInstansi,

        ProvinsiId: data.ProvinsiId,
        CityId: data.CityId,

        jumlahUnit: data.jumlahUnit,
        jumlahUnitPk: data.jumlahUnitPk,
        jumlahUnitPb: data.jumlahUnitPb,

        PenerimaManfaatId: data.PenerimaManfaatId,

        lat: data.latitude,
        lng: data.longitude,

        keterangan: data.keterangan,
        ttdBupati: data.ttdBupati,
      }
    } else if (Number(data.DirektoratId) === 4) {
      //ruk
      transformedData = {
        nik: data.nik,
        DirektoratId: Number(data.DirektoratId),
        type: Number(data.type),
        direktif: false,
        jenisData: data.jenisData,
        jenisPerumahan: data.jenisPerumahan,

        noSurat: data.noSurat,
        tglSurat: data.tanggalSurat,
        tahunBantuanPsu: data.tahunBantuanPsu,

        telponPengusul: data.telpPicPengusul,
        email: data.emailPicPengusul,
        jabatanPic: data.jabatanPicPengusul,
        picPengusul: data.namaPicPengusul,

        instansi: data.instansi,
        alamatInstansi: data.alamatInstansi,

        ProvinsiId: Number(data.ProvinsiId),
        CityId: Number(data.CityId),
        KecamatanId: Number(data.KecamatanId),
        DesaId: Number(data.DesaId),

        lat: data.latitude,
        lng: data.longitude,

        PerusahaanId: Number(data.PerusahaanId),
        namaPerumahan: data.namaPerumahan,
        alamatLokasi: data.alamatLokasi,

        bentukBantuan: data.bentukBantuan,
        besertaDrainase: data.besertaDrainase,
        rumahTerbangun: data.rumahTerbangun,
        proporsiJml: data.proporsiJml,

        jumlahUsulan: Number(data.jumlahUsulan),
        dayaTampung: Number(data.dayaTampung),
        noSuratKeputusanDaerah: data.noSuratKeputusanDaerah,
        namaKelompokMbr: data.namaKelompokMbr,
        luasanDelinasi: data.luasanDelinasi,

        dimensiJalan: data.dimensiJalan,

        statusJalan: data.statusJalan,
        detailStatus:
          data.statusJalan === 'Milik Pemda'
            ? data.keteranganStatusJalan
            : data.statusJalan === 'Lainnya'
            ? data.keteranganStatusJalanLainnya
            : '',
      }
    }

    //get wilayah relations
    const wilayah = await WilayahService.getWilayahById({
      provinsiId: data.ProvinsiId ?? null,
      cityId: data.CityId ?? null,
      kecamatanId: data.KecamatanId ?? null,
      desaId: data.DesaId ?? null,
    })

    transformedData.Provinsi = wilayah.Provinsi
    transformedData.City = wilayah.City
    transformedData.Kecamatan = wilayah.Kecamatan
    transformedData.Desa = wilayah.Desa

    if (data.PenerimaManfaatId) {
      transformedData.PenerimaManfaat =
        await PenerimaManfaatService.getPenerimaManfaatById(
          data.PenerimaManfaatId
        )
    }

    if (data.PerusahaanId) {
      transformedData.Perusahaan = await PerusahaanService.getPerusahaanById(
        data.PerusahaanId
      )
    }

    if (data.DirektoratId) {
      transformedData.Direktorat = await DirektoratService.getDirektoratById(
        data.DirektoratId
      )
    }

    if (data.MasterKegiatanId) {
      transformedData.MasterKegiatan = await MasterKegiatanService.getById(
        data.MasterKegiatanId
      )
    }

    if (data.PengembangId) {
      transformedData.Pengembang = await PengembangService.getById(
        data.PengembangId
      )
    }

    if (data.statusTerkirim) {
      transformedData.statusTerkirim = data.statusTerkirim
    }

    return transformedData
  }

  static async delete(id) {
    const usulan = await Usulan.findByPk(id)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')
    await usulan.destroy()

    const vermin = await Vermin.findOne({
      where: {
        UsulanId: usulan.id,
      },
    })
    if (vermin) {
      await vermin.destroy()
      //delete document vermin
    }

    const sasarans = await Sasaran.findAll({
      where: {
        UsulanId: usulan.id,
      },
    })
    if (sasarans && sasarans.length > 0) {
      sasarans.forEach(async (item) => {
        let SasaranId = item.id
        await Vertek.destroy({ where: { SasaranId } })
      })
    }
    await Sasaran.destroy({ where: { UsulanId: usulan.id } })

    await UsulanLokasi.destroy({
      where: {
        UsulanId: usulan.id,
      },
    })

    await UsulanPerumahan.destroy({
      where: {
        UsulanId: usulan.id,
      },
    })
  }

  static async revert(id, { noUsulan, statusTerkirim }) {
    if (!noUsulan) throw new ResponseError.BadRequest('No. Usulan diperlukan')
    if (!statusTerkirim)
      throw new ResponseError.BadRequest('Status Terkirim diperlukan')

    const usulan = await Usulan.findByPk(id)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    usulan.statusTerkirim = statusTerkirim
    await usulan.save()

    return usulan
  }

  static async updateDokumenSBU(id, dokumenSbu) {
    if (!dokumenSbu)
      throw new ResponseError.BadRequest('Dokumen SBU belum diisi')

    const usulan = await Usulan.findByPk(id)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    const dokumenSbuSource = `${dokumenSbu.destination}${dokumenSbu.filename}`
    const dokumenSbuName = dokumenSbu.filename

    let s3url
    const s3key = `aspirasi/${id}/${dokumenSbuName}`

    try {
      s3url = await uploadFileToS3(dokumenSbuSource, s3key)
      fs.unlinkSync(dokumenSbuSource)
    } catch {
      throw new ResponseError.BadRequest('Upload Dokumen SBU gagal!')
    }

    dokumenSbu.isS3 = true
    dokumenSbu.s3url = s3url

    await usulan.update({
      dokumenSbu,
    })

    return usulan
  }

  static async updateVerlok(id, { keteranganVertek, statusVertek }) {
    const usulan = await Usulan.findByPk(id)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    usulan.keteranganVertek = keteranganVertek
    usulan.statusVertek = statusVertek

    await usulan.save()

    return {
      id: usulan.id,
      keteranganVertek: usulan.keteranganVertek,
      status: usulan.statusVertek,
    }
  }

  static async update(id, body) {
    let { sasarans, komponenPengajuan, usulanPerumahan, usulanLokasi } = body

    const usulan = await Usulan.findByPk(id)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    let { statusVermin } = usulan
    if (
      usulan.statusTerkirim === 'revisi' &&
      body.statusTerkirim === 'terkirim'
    ) {
      statusVermin = null
    }

    const newBody = await this.usulanTransform(body)

    await usulan.update({
      ...newBody,
      statusVermin,
    })

    // if (Array.isArray(sasarans)) {
    //   await Sasaran.destroy({ where: { UsulanId: id } })

    //   sasarans = sasarans.map((item) => {
    //     let result = {
    //       ...item,
    //       rtlh: item.rtlh ? item.rtlh : null,
    //       UsulanId: id,
    //     }
    //     return _.omit(result, ['id'])
    //   })

    //   await Sasaran.bulkCreate(sasarans)
    // }

    if (Array.isArray(sasarans) && sasarans.length > 0) {
      await Sasaran.destroy({ where: { UsulanId: id } })

      sasarans = await Promise.all(
        sasarans.map(async (item) => ({
          ...(await this.sasaranTransform(item)),
          rtlh: item.rtlh ? item.rtlh : null,
          UsulanId: usulan.id,
        }))
      )

      sasarans = await Sasaran.bulkCreate(sasarans, { return: true })
    }

    if (Array.isArray(usulanLokasi)) {
      await UsulanLokasi.destroy({ where: { UsulanId: id } })
      const newLokasiData = usulanLokasi.map((item) => {
        const form = { ...item, UsulanId: id }
        return _.omit(form, ['id'])
      })

      await UsulanLokasi.bulkCreate(newLokasiData)
    }

    if (Array.isArray(usulanPerumahan)) {
      await UsulanPerumahan.destroy({ where: { UsulanId: id } })
      const newPerumahanData = usulanPerumahan.map((item) => {
        const form = { ...item, UsulanId: id }
        return _.omit(form, ['id'])
      })

      await UsulanPerumahan.bulkCreate(newPerumahanData)
    }

    if (
      komponenPengajuan &&
      typeof komponenPengajuan === 'object' &&
      komponenPengajuan.length >= 0
    ) {
      await KomponenPengajuan.destroy({
        where: { UsulanId: id },
      })
      let pengajuanStore = []
      komponenPengajuan.forEach(async (item) => {
        const mkp = await MasterKomponenPengajuanService.getById(item)
        return pengajuanStore.push({
          UsulanId: id,
          MasterKomponenPengajuanId: item,
          MasterKomponenPengajuan: mkp,
        })
      })
      await KomponenPengajuan.bulkCreate(pengajuanStore)
    }

    return usulan
  }

  static async findAllDokumen(id, accessTokenInternal) {
    let usulan = await Usulan.findByPk(id)

    if (!usulan) {
      throw new ResponseError.NotFound('Usulan tidak ditemukan')
    }

    const vermin = await Vermin.findOne({
      where: {
        UsulanId: id,
      },
      include: [{ model: Dokumen }],
    })

    const masterDokumens =
      await MasterDokumenService.getAllByDirektoratIdAndModel(
        usulan.direktoratId,
        'Vermin',
        accessTokenInternal
      )

    let dokumens = masterDokumens.filter(({ jenisData }) => {
      const jenisDataArray = jenisData ? JSON.parse(jenisData) : []
      const incJenisData = usulan.jenisData ? usulan.jenisData : 0

      return jenisDataArray.includes(incJenisData)
    })

    dokumens = dokumens.filter(({ jenisDirektif }) => {
      const jenisDirektifArray = jenisDirektif ? JSON.parse(jenisDirektif) : []
      const incJenisDirektif = usulan.direktif === true ? 1 : 0

      return jenisDirektifArray.includes(incJenisDirektif)
    })

    let verminDokumen = []

    for (const dokumen of dokumens) {
      let existDoc = null

      for (const verDok of vermin.Dokumens) {
        if (verDok.MasterDokumenId === dokumen.id) {
          existDoc = verDok
          break
        }
      }

      if (existDoc) {
        verminDokumen.push({
          ...dokumen,
          vermin: existDoc,
        })
      } else {
        verminDokumen.push({
          ...dokumen,
        })
      }
    }

    return {
      message: 'success',
      data: verminDokumen,
    }
  }

  static async exportExcelList(req, res, userLogin) {
    let { sorted, filtered, attributes, pageSize, page } = req.getQuery()

    if (!filtered) {
      throw new ResponseError.BadRequest('Silahkan pilih setidaknya 1 filter')
    }

    pageSize = isNaN(pageSize) ? 999999 : parseInt(pageSize)
    page = isNaN(page) ? 1 : parseInt(page)

    let query = {
      ...req.query,
      pageSize,
      page,
    }

    if (sorted) {
      const parsedSorted = JSON.parse(sorted)
      const indexPrioritasNilai = _.findIndex(
        parsedSorted,
        (item) => item.id === 'prioritasNilai'
      )
      if (indexPrioritasNilai !== -1) {
        parsedSorted[indexPrioritasNilai].id = 'totalNilaiPrioritas'
      }
      req.query.sorted = JSON.stringify(parsedSorted)
    }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      query,
      Usulan,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, [])
    )

    if (filtered) {
      const parsedFilter = JSON.parse(filtered)

      // tahunSuratUsulan
      const indexTahunSurat = _.findIndex(
        parsedFilter,
        (item) => item.id === 'tahunSuratUsulan'
      )
      let tahunSuratUsulan = _.find(
        parsedFilter,
        (item) => item.id === 'tahunSuratUsulan'
      )
      if (Array.isArray(parsedFilter) && indexTahunSurat !== -1)
        parsedFilter.splice(indexTahunSurat, 1)

      //tahunUsulan
      const indexTahun = _.findIndex(
        parsedFilter,
        (item) => item.id === 'tahunUsulan'
      )
      let tahunUsulan = _.find(
        parsedFilter,
        (item) => item.id === 'tahunUsulan'
      )
      if (Array.isArray(parsedFilter) && indexTahun !== -1)
        parsedFilter.splice(indexTahun, 1)

      // filter by logged in admin direktorat role
      if (userLogin.RoleId) {
        const adminDirektoratRoleId = [24, 25, 27, 28]
        if (adminDirektoratRoleId.includes(userLogin.RoleId)) {
          const indexDirektoratId = _.findIndex(
            parsedFilter,
            (item) => item.id === 'DirektoratId'
          )
          if (Array.isArray(parsedFilter) && indexDirektoratId !== -1)
            parsedFilter.splice(indexDirektoratId, 1)

          queryFind.where = {
            ...queryFind.where,
            DirektoratId: userLogin.Role.DirektoratId,
          }
        }
      }

      filtered = JSON.stringify(parsedFilter)

      if (tahunSuratUsulan) {
        queryFind.where = {
          ...queryFind.where,
          [Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tglSurat')), {
              [Op.eq]: tahunSuratUsulan.value,
            }),
          ],
        }

        delete queryFind.where.tahunSuratUsulan
      }

      if (tahunUsulan) {
        queryFind.where = {
          ...queryFind.where,
          [Op.or]: [
            {
              tahunProposal: {
                [Op.eq]: tahunUsulan.value,
              },
            },
            {
              tahunBantuanPsu: {
                [Op.eq]: tahunUsulan.value,
              },
            },
          ],
        }

        delete queryFind.where.tahunUsulan
      }
    }

    queryFind.where = {
      ...queryFind.where,
      ...this.filterIncludeJson(filtered, [
        'prioritasJenis',
        'prioritasRangkaianPemrograman',
      ]),
    }

    const data = await Usulan.findAll({
      ...queryFind,
      attributes,
      order: order.length ? order : [['createdAt', 'DESC']],
      logging: console.log,
    })

    const excelCols = [
      { header: 'Tanggal Usulan', key: 'createdAt', width: 14 },
      { header: 'Tanggal Surat', key: 'tglSurat', width: 14 },
      { header: 'Tahun Usulan', key: 'tahunProposal', width: 14 },
      { header: 'Kegiatan', key: 'kegiatan', width: 32 },
      { header: 'Jumlah Unit', key: 'jumlahUnit', width: 14 },
      { header: 'Jumlah Usulan', key: 'jumlahUsulan', width: 14 },
      { header: 'Uraian Pekerjaan', key: 'uraian', width: 64 },
      { header: 'KRO', key: 'kro', width: 64 },
      { header: 'RO', key: 'ro', width: 64 },
      { header: 'Anggaran', key: 'anggaran', width: 16 },
      { header: 'Provinsi', key: 'provinsi', width: 24 },
      { header: 'Kabupaten', key: 'kabupaten', width: 24 },
      { header: 'Kecamatan', key: 'kecamatan', width: 24 },
      { header: 'Desa', key: 'desa', width: 24 },
      { header: 'Nama PIC Pengusul', key: 'pengusul', width: 24 },
      { header: 'Penerima Manfaat', key: 'penerimaManfaat', width: 48 },
      { header: 'User Pengusul', key: 'userPengusul', width: 24 },
      { header: 'Instansi Pengusul', key: 'instansi', width: 64 },
      { header: 'Status Usulan', key: 'statusTerkirim', width: 14 },
      { header: 'Status Vermin', key: 'statusVermin', width: 14 },
      { header: 'Status Vertek', key: 'statusVertek', width: 14 },
      { header: 'Konreg Pool', key: 'konregPool', width: 14 },
    ]

    const workbook = new excel.Workbook()
    const worksheet = workbook.addWorksheet('Usulan')
    worksheet.columns = excelCols

    worksheet.addRows(
      data.map((record) => {
        record.kro = record?.ProOutput?.nama
        record.ro = record?.ProSubOutput?.nama

        record.provinsi = record?.Provinsi?.nama
        record.kabupaten = record?.City?.nama
        record.kecamatan = record?.Kecamatan?.nama
        record.desa = record?.Desa?.nama

        record.penerimaManfaat = record?.PenerimaManfaat?.tipe

        record.userPengusul = record?.User?.fullName

        switch (record.statusVermin) {
          case 1:
            record.statusVermin = 'Lengkap'
            break
          case 0:
            record.statusVermin = 'Tidak Lengkap'
            break
          default:
            record.statusVermin = 'Belum'
            break
        }

        switch (record.statusVertek) {
          case 1:
            record.statusVertek = 'Lengkap'
            break
          case 0:
            record.statusVertek = 'Tidak Lengkap'
            break
          default:
            record.statusVertek = 'Belum'
            break
        }

        switch (true) {
          case record.anggaran !== null &&
            record.kroId !== null &&
            record.uraian !== null &&
            record.siproId !== null:
            record.konregPool = 'Sync'
            break
          case record.anggaran !== null &&
            record.kroId !== null &&
            record.uraian !== null:
            record.konregPool = 'Pool'
            break
          default:
            record.konregPool = 'Belum'
            break
        }

        return record
      })
    )

    worksheet.eachRow((col, index) => {
      if (index === 1) col.font = { bold: true }
      col.alignment = { wrapText: true }
    })

    const fileName = `aspirasi-${Math.random()}.xlsx`
    const fileSource = `./tmp/${fileName}`

    try {
      await workbook.xlsx.writeFile(fileSource)
    } catch {
      throw new ResponseError.BadRequest('Gagal membuat file')
    }

    let s3url

    try {
      const s3key = 'laporan/aspirasi.xlsx'
      await removeS3File(s3key)
      s3url = await uploadFileToS3(fileSource, s3key, true)
      fs.unlinkSync(fileSource)
    } catch (error) {
      console.log(error)
      throw new ResponseError.BadRequest('Gagal mengupload file ke S3')
    }

    return s3url
  }
}

export default UsulanService
