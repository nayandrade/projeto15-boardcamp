import { Router } from 'express';
import { getGames, postGame } from '../controllers/gamesControllers.js';
import validateGameMiddleware from '../middlewares/validadeGamesMiddleware.js';

const router = Router()

router.get('/games', getGames)
router.post('/games', validateGameMiddleware, postGame)

export default router