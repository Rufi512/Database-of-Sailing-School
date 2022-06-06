import {Router} from 'express'
import * as chestCtrl from '../controllers/chest_controller'
const router = Router()
//GET
router.get('/:id',chestCtrl.info)

export default router