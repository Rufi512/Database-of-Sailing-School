import {Router} from 'express'
import * as repCtrl from '../controllers/representative_controller'
const router = Router()
//POST
router.get('/register',repCtrl.register)
//PUT
router.put('/update/:id',repCtrl.update)


export default router