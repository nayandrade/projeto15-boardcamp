import connection from '../database/database.js';

export async function getGames(req, res) {
    const name = req.query.name;
    const defaultQuery = `
    SELECT games.*, categories.name as "categoryName" 
    FROM games
    JOIN categories
    ON games."categoryId"=categories.id
    `
    try {
        if(name) {
            const { rows: games } = await connection.query(`
            ${defaultQuery}
            WHERE lower(games.name) LIKE $1
            OR upper(games.name) LIKE $1
            OR games.name LIKE $1
            `, [`${name}%`]);
            return res.send(games)
        }
        const { rows: games } = await connection.query(defaultQuery)
        return res.status(200).send(games)
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