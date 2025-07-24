import express from 'express'
import { TMP_PATH } from '../../config/env'
import ResponseError from '../../modules/Error'
import AsyncHandler from '../../helpers/AsyncHandler'
import useMulter from '../../hooks/useMulter'
import AuthMiddleware from '../../middlewares/AuthMiddleware'
import UsulanService from './service'
import VerminService from '../Vermin/service'
import SasaranService from '../../controllers/Sasaran/service'
import CommentUsulanService from '../../controllers/CommentUsulan/service'

const uploadDokumenSbu = useMulter({
  dest: `${TMP_PATH}/`,
}).fields([{ name: 'dokumenSbu', maxCount: 1 }])

const route = express.Router()

route.get(
  '/',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    // let { page = 1, pageSize = 10 } = req.query
    // const data = await UsulanService.findAllPaginate(page, pageSize, req.query)

    const userLogin = res.locals.profile

    const data = await UsulanService.findAllPaginate(req, userLogin)
    res.json(data)
  })
)

route.get(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const data = await UsulanService.findById(id)
    res.json(data)
  })
)

route.post(
  '/ruk',
  AuthMiddleware,
  uploadDokumenSbu,
  AsyncHandler(async function handler(req, res) {
    const { profile, accessTokenInternal } = res.locals
    const { body } = req
    const {
      namaPicPengusul,
      telpPicPengusul,
      emailPicPengusul,
      jabatanPicPengusul,
      perusahaanPengusul,
      asosiasiPengusul,
      namaDirekturPengusul,
      telpDirekturPengusul,
      emailPengusul,
      alamatPengusul,
      ProvinsiIdPengusul,
      CityIdPengusul,
      KecamatanIdPengusul,
      DesaIdPengusul,
    } = body
    const dokumenSbu = (req.files && req.files.dokumenSbu)?req.files.dokumenSbu[0]:null

    let data
    
    if (perusahaanPengusul) {
      const resPerusahaan = await UsulanService.createPerusahaan({
        telpPenanggungJawab: telpPicPengusul,
        name: perusahaanPengusul,
        asosiasi: asosiasiPengusul,
        namaDirektur: namaDirekturPengusul,
        telpDirektur: telpDirekturPengusul,
        email: emailPengusul,
        alamat: alamatPengusul,
        ProvinsiId: ProvinsiIdPengusul,
        CityId: CityIdPengusul,
        KecamatanId: KecamatanIdPengusul,
        DesaId: DesaIdPengusul,
      }, accessTokenInternal)
  
      if (resPerusahaan && resPerusahaan.data) {
        const PerusahaanId = resPerusahaan.data.id
    
        data = await UsulanService.create({
          ...body,
          PerusahaanId,
          dokumenSbu,
        }, profile)
      }
      else {
        throw new ResponseError.BadRequest('Gagal membuat perusahaan')
      }
    }
    else {
      data = await UsulanService.create({
        ...body,
        dokumenSbu,
      }, profile)
    }

    res.json(data)
  })
)

route.post(
  '/:id/comment',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id: UsulanId } = req.params
    const { message } = req.body
    const { 
      id,
      nama,
      username,
      email,
      instansi,
      alamatInstansi,
    } = res.locals.profile

    const data = await CommentUsulanService.create({
      message,
      UsulanId,
      UserId: id,
      User: { 
        id,
        nama,
        username,
        email,
        instansi,
        alamatInstansi,
      },
    })

    res.json(data)
  })
)

route.post(
  '/',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { profile } = res.locals
    const body = req.body
    const data = await UsulanService.create(body, profile)
    res.json(data)
  })
)

route.delete(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    await UsulanService.delete(id)
    res.json({
      message: 'success',
    })
  })
)

route.get(
  '/:id/vermin',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const data = await VerminService.findOneByUsulanId(id)
    res.json(data)
  })
)

route.get(
  '/:id/dokumen',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const { accessTokenInternal } = res.locals

    const data = await UsulanService.findAllDokumen(id, accessTokenInternal)
    res.json(data)
  })
)

route.put(
  '/revert/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const {
      noUsulan,
      statusTerkirim,
    } = req.body

    const data = await UsulanService.revert(id, {
      noUsulan,
      statusTerkirim,
    })

    res.json(data)
  })
)

route.put(
  '/:id/dokumen-sbu',
  AuthMiddleware,
  uploadDokumenSbu,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const dokumenSbu = (req.files && req.files.dokumenSbu)?req.files.dokumenSbu[0]:null
    const data = await UsulanService.updateDokumenSBU(id, dokumenSbu)
    res.json(data)
  })
)

route.put(
  '/:id/verlok',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const {
      keteranganVertek,
      statusVertek,
    } = req.body 
    
    const data = await UsulanService.updateVerlok(id, {
      keteranganVertek,
      statusVertek,
    })

    res.json({ 
      message: 'Data berhasil diupdate', 
      data, 
    })
  })
)

route.put(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const data = await UsulanService.update(id, req.body)
    res.json(data)
  })
)

route.get(
  '/:id/sasaran',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const data = await SasaranService.findByUsulanId(id)
    res.json(data)
  })
)

route.get(
  '/export/excel',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const s3url = await UsulanService.exportExcelList(req)
    res.json({ s3url })
  })
)

export default route
