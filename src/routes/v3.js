import Express from 'express'

// add controller here
import HomeController from '../controllers/Home/controller'
import UsulanController from '../controllers/Usulan/controller'
import VerminController from '../controllers/Vermin/controller'
import VertekController from '../controllers/Vertek/controller'
import DokumenController from '../controllers/Dokumen/controller'
import SasaranController from '../controllers/Sasaran/controller'
import FilterController from '../controllers/Filter/controller'
import UserController from '../controllers/User/controller'
import WilayahController from '../controllers/Wilayah/controller'

const route = Express.Router()

route.use('/v3', HomeController)
route.use('/v3/usulan', UsulanController)
route.use('/v3/vermin', VerminController)
route.use('/v3/vertek', VertekController)
route.use('/v3/dokumen', DokumenController)
route.use('/v3/sasaran', SasaranController)
route.use('/v3/filter', FilterController)
route.use('/v3/user', UserController)
route.use('/v3/wilayah', WilayahController)

export default route
