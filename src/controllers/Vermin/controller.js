import express from 'express'
import { TMP_PATH } from '../../config/env'
import AsyncHandler from '../../helpers/AsyncHandler'
import AuthMiddleware from '../../middlewares/AuthMiddleware'
import useMulter from '../../hooks/useMulter'
import VerminService from './service'

const uploadFilePdf = useMulter({
  dest: `${TMP_PATH}/`,
}).fields([{ name: 'filePdf', maxCount: 1 }])

const route = express.Router()

route.put(
  '/:id',
  AuthMiddleware,
  AsyncHandler(async function handler(req, res) {
    const { accessTokenInternal } = res.locals
    const { id } = req.params
    const { body } = req

    const data = await VerminService.update(id, body, accessTokenInternal)
    
    res.json({ 
      message: 'Data berhasil diupdate', 
      data, 
    })
  })
)

route.post(
  '/notification-email',
  AuthMiddleware,
  uploadFilePdf,
  AsyncHandler(async function handler(req, res) {
    const { 
      VerminId,
      ditRususVerminId, 
    } = req.body

    const filePdf = (req.files && req.files.filePdf)?req.files.filePdf[0]:null

    const data = await VerminService.notificationEmail({ 
      VerminId,
      ditRususVerminId, 
    }, filePdf)
    
    res.json({ 
      message: 'Notifikasi berhasil dikirim', 
      data, 
    })
  })
)

export default route
