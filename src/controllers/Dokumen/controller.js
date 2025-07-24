import express from 'express'
import { TMP_PATH } from '../../config/env'
import AsyncHandler from '../../helpers/AsyncHandler'
import useMulter from '../../hooks/useMulter'
import AuthMiddleware from '../../middlewares/AuthMiddleware'
import DokumenService from './service'

const uploadFile = useMulter({
  dest: `${TMP_PATH}/`,
}).fields([{ name: 'file', maxCount: 1 }])

const route = express.Router()

route.get(
  '/',
  // AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const data = await DokumenService.findAll(req.query)
    res.json(data)
  })
)

route.put(
  '/:id',
  AuthMiddleware,
  uploadFile,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const { accessTokenInternal } = res.locals
    const {
      model,
      ModelId,
      UsulanId,
      MasterDokumenId,
      keterangan,
      lengkap,
      status,
    } = req.body

    const file = (req.files && req.files.file)?req.files.file[0]:null

    const newBody = {
      model,
      ModelId,
      UsulanId,
      MasterDokumenId,
      keterangan: keterangan?keterangan:null,
      lengkap: lengkap?lengkap:null,
      status: status?status:null,
      file,
    }
    
    const data = await DokumenService.update(id, newBody, accessTokenInternal)
    
    res.json({
      message: 'success',
      data,
    })
  })
)

route.post(
  '/',
  AuthMiddleware,
  uploadFile,
  AsyncHandler(async function handler(req, res) {
    const { accessTokenInternal } = res.locals
    const {
      model,
      ModelId,
      UsulanId,
      MasterDokumenId,
      keterangan,
      lengkap,
      status,
    } = req.body

    const file = (req.files && req.files.file)?req.files.file[0]:null

    const newBody = {
      model,
      ModelId,
      UsulanId,
      MasterDokumenId,
      keterangan: keterangan?keterangan:null,
      lengkap: lengkap?lengkap:null,
      status: status?status:null,
      file,
    }
    
    const data = await DokumenService.create(newBody, accessTokenInternal)
    
    res.status(201).json({
      message: 'success',
      data,
    })
  })
)

route.delete(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    await DokumenService.delete(id)
    res.json({
      message: 'success',
    })
  })
)

export default route
