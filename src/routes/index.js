import Express from 'express'
import HomeController from '../controllers/Home/controller'

const route = Express.Router()

// Index Route
route.get('/', HomeController)

export default route
