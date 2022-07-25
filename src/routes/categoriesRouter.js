import { Router } from 'express';
import { getCategories, postCategory } from '../controllers/categoriesControllers.js';
import validateCategoryMiddleware from '../middlewares/validateCategoryMiddleware.js'

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', validateCategoryMiddleware, postCategory);


export default router;