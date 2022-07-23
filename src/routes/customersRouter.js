import { Router } from 'express';

const router = Router()

router.get('/customers')
router.get('/customers/:id')
router.post('/customers')
router.put('/customers/:id')

export default router