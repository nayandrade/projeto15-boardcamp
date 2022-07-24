import connection from '../database/database.js';

export async function getRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    const defaultQuery = `
    SELECT rentals.*, 
    json_build_object(
        'id',customers.id, 
        'name',customers.name
    ) AS customer,
    json_build_object(
        'id',games.id, 
        'name',games.name, 
        'categoryId',
        games."categoryId", 
        'categoryName',
        categories.name
    ) AS game	
    FROM rentals
    JOIN customers 
    ON rentals."customerId"=customers.id
    JOIN games 
    ON games.id = rentals."gameId"
    JOIN categories
    ON categories.id = games."categoryId"
    `

    try {
        if(customerId && !gameId) {
            const { rows: rentals } = await connection.query(`
            ${defaultQuery}
            WHERE "customerId"=${customerId}
            `);
        return res.send(rentals)
        }
        if(gameId && !customerId) {
            const { rows: rentals } = await connection.query(`
            ${defaultQuery}
            WHERE rentals."gameId"=${gameId}            
            `);
        return res.send(rentals)

        } 
        if(!customerId && !gameId) {
            const { rows: rentals } = await connection.query(`
            ${defaultQuery}
            `);
        return res.send(rentals)
        }
        
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export async function postRent(req, res) {
    const rentRequest = req.body;
    try {
        const customerSearch = await connection.query(`
        SELECT * FROM customers 
        WHERE id = $1 
        `, [rentRequest.customerId]);
        if(customerSearch.rows.length === 0) {
            return res.sendStatus(400)
        }

        const gamesSearch = await connection.query(`
        SELECT * FROM games
        WHERE id = $1
        `, [rentRequest.gameId]);
        if(gamesSearch.rows.length === 0) {
            return res.sendStatus(400)
        }
        const gameRented = gamesSearch.rows[0];

        const originalPrice = gameRented.pricePerDay * rentRequest.daysRented;
        console.log(typeof rentRequest.daysRented, originalPrice, typeof originalPrice)
        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, now(), $3, null, $4, null )
        `, [rentRequest.customerId, rentRequest.gameId, rentRequest.daysRented, originalPrice]);
        return res.sendStatus(201)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)        
    }
}

export async function returnRent(req, res) {
    const { id } = req.params
    try {
        const verifyRental = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE id = $1
        `,[id]);
        if(verifyRental.rows.length <= 0) {
            return res.sendStatus(404)
        }
        const rental = verifyRental.rows[0];
        if(rental.returnDate) {
            return res.sendStatus(400)
        }
        const todayTime = new Date().getTime();
        const returnTime = new Date(rental.rentDate).getTime();
        const returnDelay = Math.ceil((todayTime - returnTime) / (1000 * 60 * 60 * 24));
        let delayFee = 0;
        console.log(todayTime, returnTime, returnDelay, rental.daysRented)
        if(returnDelay > rental.daysRented) {
            delayFee = (returnDelay - rental.daysRented) * (rental.originalPrice / rental.daysRented);
            
        }
        await connection.query(`
        UPDATE rentals
        SET "returnDate"=now(), "delayFee"=$1
        WHERE id = $2
        `,[delayFee, id]);
        return res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
}

export async function deleteRent(req, res) {
    const { id } = req.params;
    try {
        const verifyRental = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE id = $1
        `,[id]);
        if(verifyRental.rows.length <= 0) {
            return res.sendStatus(404)
        }
        const rental = verifyRental.rows[0];
        if(!rental.returnDate) {
            return res.sendStatus(400)
        }
        await connection.query(`
        DELETE 
        FROM rentals
        WHERE id = $1
        `,[id]);
        
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
}