import express from 'express'
import { TMP_PATH } from '../../config/env'
import AsyncHandler from '../../helpers/AsyncHandler'
import useMulter from '../../hooks/useMulter'
import VertekService from '../../controllers/Vertek/service'

const uploadDoc = useMulter({
  dest: `${TMP_PATH}/`,
}).fields([{ name: 'doc', maxCount: 1 }])

const route = express.Router()

route.get(
  '/:id/vertek',
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const data = await VertekService.findBySasaranId(id)
    
    res.json({
      message: 'Data berhasil diambil',
      data,
    })
  })
)

route.post(
  '/:id/vertek',
  uploadDoc,
  AsyncHandler(async function handler(req, res) {
    const { id } = req.params
    const doc = (req.files && req.files.doc)?req.files.doc[0]:null

    const data = await VertekService.update(id, req.body, doc)

    res.json({ 
      message: 'Data berhasil diupdate', 
      data, 
    })
  })
)

export default route
