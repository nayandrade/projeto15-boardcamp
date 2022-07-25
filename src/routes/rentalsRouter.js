import { Router } from 'express';
import { getRentals, postRent, returnRent, deleteRent } from '../controllers/rentalsControllers.js'
import { validateRentalCustomerMiddleware, validateRentalMiddleware } from '../middlewares/validateRentalMiddleware.js'

const router = Router()

router.get('/rentals', getRentals)
router.post('/rentals', validateRentalCustomerMiddleware, validateRentalMiddleware, postRent)
router.post('/rentals/:id/return', returnRent)
router.delete('/rentals/:id', deleteRent)

export default router