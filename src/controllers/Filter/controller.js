import express from 'express'
import AsyncHandler from '../../helpers/AsyncHandler'
import FilterService from './service'

const route = express.Router()

route.get(
  '/tahunusulan',
  AsyncHandler(async function handler(req, res) {
    const data = await FilterService.getTahunUsulan(req)
    res.json(data)
  })
)

export default route
