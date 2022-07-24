import connection from '../database/database.js';
import postGamesSchema from '../schemas/postGamesSchema.js';


export default async function validateGameMiddleware(req, res, next) {
    const  { error } = postGamesSchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const checkCategory = await connection.query(`
        SELECT * FROM categories
        WHERE id = $1
        `, [req.body.categoryId]);
        if(checkCategory.rows.length === 0) {
            return res.status(400).send('Category not found');
        }
        const checkGame = await connection.query(`
        SELECT * FROM games
        WHERE name = $1
        `, [req.body.name]);
        if(checkGame.rows.length > 0) {
            return res.status(400).send('Game already exists');
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
    next();
}