import express from 'express'
import { TMP_PATH } from '../../config/env'
import AsyncHandler from '../../helpers/AsyncHandler'
import AuthMiddleware from '../../middlewares/AuthMiddleware'
import useMulter from '../../hooks/useMulter'
import VertekService from './service'

const uploadDokumenLapangan = useMulter({
  dest: `${TMP_PATH}/`,
}).fields([{ name: 'dokumenLapangan', maxCount: 1 }])

const route = express.Router()

route.put(
  '/:id/dokumen-lapangan',
  AuthMiddleware,
  uploadDokumenLapangan,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const { body } = req
    
    const dokumenLapangan = (req.files && req.files.dokumenLapangan)?req.files.dokumenLapangan[0]:null

    const data = await VertekService.updateDokumenLapangan(
      id, 
      body,
      dokumenLapangan
    )
    
    res.json({ 
      message: 'Dokumen berhasil diupload', 
      data, 
    })
  })
)

route.put(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const { body } = req

    const data = await VertekService.update(
      id, 
      body
    )
    
    res.json({ 
      message: 'Data berhasil diupdate', 
      data, 
    })
  })
)

export default route
