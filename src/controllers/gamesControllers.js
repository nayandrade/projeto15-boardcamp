import connection from '../database/database.js';

export async function getGames(req, res) {
    try {
        const games = await connection.query(`
        SELECT games.*, categories.name as "categoryName" 
        FROM games
        JOIN categories
        ON games."categoryId"=categories.id
        `)
        return res.status(200).send(games.rows)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)        
    }
}

export async function postGame(req, res) {
    try {
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body
        const { rows: game } = await connection.query(`
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
        `, [name, image, stockTotal, categoryId, pricePerDay])
        console.log(game)
        return res.status(201).send(game[0])
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}