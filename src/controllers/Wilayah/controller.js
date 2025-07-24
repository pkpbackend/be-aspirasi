import express from 'express'
import AsyncHandler from '../../helpers/AsyncHandler'
import WilayahService from './service'

const route = express.Router()

route.get(
  '/sync',
  AsyncHandler(async function handler(req, res) {
    const data = await WilayahService.syncWilayah()
    res.json({ data })
  })
)

export default route
