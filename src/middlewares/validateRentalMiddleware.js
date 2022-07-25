import postRentSchema from "../schemas/postRentSchema.js";
import connection from "../database/database.js";

export async function validateRentalCustomerMiddleware(req, res, next) {
    const { customerId } = req.body;
    const { error } = postRentSchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const customerSearch = await connection.query(`
        SELECT * FROM customers 
        WHERE id = $1 
        `, [customerId]);
        if(customerSearch.rows.length === 0) {
            return res.sendStatus(400);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500); 
    }
    next();
}

export async function validateRentalMiddleware(req, res, next) {
    const { gameId } = req.body;
    try {
        const gamesSearch = await connection.query(`
        SELECT * FROM games
        WHERE id = $1
        `, [gameId]);

        if (gamesSearch.rows.length === 0) {
            return res.status(400).send('jogo não encontrado');
        }
        const hasStock = await connection.query(`
        SELECT * FROM rentals
        JOIN games
        ON rentals."gameId"=games.id
        WHERE rentals."gameId" = $1
        AND rentals."returnDate" IS NULL
        `, [gameId]);

        if (hasStock.rows.length >= gamesSearch.rows[0].stockTotal) {
            return res.status(400).send('sem estoque');
        }

        res.locals.gamesSearch = gamesSearch;
         
    } catch (error) {
       console.error(error);
       res.sendStatus(500); 
    }
    next();
}