import { Router } from 'express';
import { getCustomers, getCustomerById, postCustomer, editCustomer } from '../controllers/customersControllers.js';

const router = Router()

router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomerById)
router.post('/customers', postCustomer)
router.put('/customers/:id', editCustomer)

export default router