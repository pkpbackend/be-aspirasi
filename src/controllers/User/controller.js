import express from 'express'
import AsyncHandler from '../../helpers/AsyncHandler'
import UserService from './service'

const route = express.Router()

route.post(
  '/sync',
  AsyncHandler(async function handler(req, res) {
    const { body } = req
    const data = await UserService.syncUser(body)
    res.json(data)
  })
)

export default route
