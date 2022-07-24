import { Router } from 'express';
import { getCustomers, getCustomerById, postCustomer, editCustomer } from '../controllers/customersControllers.js';
import validateCustomerMiddleware from '../middlewares/validateCustomerMiddleware.js';

const router = Router()

router.get('/customers', getCustomers)
router.get('/customers/:id', getCustomerById)
router.post('/customers', validateCustomerMiddleware, postCustomer)
router.put('/customers/:id', editCustomer)

export default router