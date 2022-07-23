import connection from '../database/database.js';

export async function getRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    console.log(customerId, gameId);

    try {
        if(customerId) {
            const { rows: rentals } = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
            FROM rentals
            JOIN customers 
            ON rentals."customerId"=customers.id
            JOIN games 
            ON games.id = rentals."gameId"
            JOIN categories
            ON categories.id = games."categoryId"
            WHERE "customerId"=${customerId}
            `);
            const detailedRental = [];
            for(let i = 0; i< rentals.length; i++) {
                detailedRental.push({
                    ...rentals[i],
                    customer: {
                        id: rentals[i].customerId,
                        name: rentals[i].customerName
                    },
                    game: {
                        id: rentals[i].gameId,
                        name: rentals[i].gameName,
                        categoryId: rentals[i].categoryId,
                        categoryName: rentals[i].categoryName
                    }
                })
                delete detailedRental[i].customerName;
                delete detailedRental[i].gameName;
                delete detailedRental[i].categoryName;
                delete detailedRental[i].categoryId; 
            }
        return res.send(detailedRental)
        }
        if(gameId) {
            const { rows: rentals } = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
            FROM rentals
            JOIN customers 
            ON rentals."customerId"=customers.id
            JOIN games 
            ON games.id = rentals."gameId"
            JOIN categories
            ON categories.id = games."categoryId"
            WHERE rentals."gameId"=${gameId}            
            `);
            console.log(rentals)
            const detailedRental = [];
            for(let i = 0; i< rentals.length; i++) {
                detailedRental.push({
                    ...rentals[i],
                    customer: {
                        id: rentals[i].customerId,
                        name: rentals[i].customerName
                    },
                    game: {
                        id: rentals[i].gameId,
                        name: rentals[i].gameName,
                        categoryId: rentals[i].categoryId,
                        categoryName: rentals[i].categoryName
                    }
                })
                delete detailedRental[i].customerName;
                delete detailedRental[i].gameName;
                delete detailedRental[i].categoryName;
                delete detailedRental[i].categoryId; 
            }
        return res.send(detailedRental)

        } 
        if(!customerId && !gameId) {
            const { rows: rentals } = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName" 
            FROM rentals
            JOIN customers 
            ON rentals."customerId"=customers.id
            JOIN games 
            ON games.id = rentals."gameId"
            JOIN categories
            ON categories.id = games."categoryId"            
            `);
            console.log(rentals)
            const detailedRental = [];
            for(let i = 0; i< rentals.length; i++) {
                detailedRental.push({
                    ...rentals[i],
                    customer: {
                        id: rentals[i].customerId,
                        name: rentals[i].customerName
                    },
                    game: {
                        id: rentals[i].gameId,
                        name: rentals[i].gameName,
                        categoryId: rentals[i].categoryId,
                        categoryName: rentals[i].categoryName
                    }
                })
                delete detailedRental[i].customerName;
                delete detailedRental[i].gameName;
                delete detailedRental[i].categoryName;
                delete detailedRental[i].categoryId; 
            }
        return res.send(detailedRental)
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
        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, now(), $3, null, $4, null    )
        `, [rentRequest.customerId, rentRequest.gameId, rentRequest.daysRented, originalPrice]);
        res.sendStatus(201)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)        
    }
}

export async function returnRent(req, res) {
    const { id } = req.params
    console.log(id)

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
            console.log(delayFee)
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