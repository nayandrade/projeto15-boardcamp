import { Router } from 'express';
import { getRentals, postRent, returnRent, deleteRent } from '../controllers/rentalsControllers.js'

const router = Router()

router.get('/rentals', getRentals)
router.post('/rentals', postRent)
router.post('/rentals/:id/return', returnRent)
router.delete('/rentals/:id', deleteRent)

export default router