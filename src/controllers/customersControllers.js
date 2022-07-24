import connection from "../database/database.js";

export async function getCustomers(req, res) {
    const cpf = req.query.cpf;
    try {
        if(cpf) {
            const { rows: customers } = await connection.query(`
            SELECT * FROM customers
            WHERE cpf LIKE $1
            `, [`${cpf}%`]);
            return res.send(customers)
        }
        const { rows: customers } = await connection.query(`
        SELECT * FROM customers
        `);
        return res.status(200).send(customers);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const { rows: customers } = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1
        `, [id]);
        if(customers.length === 0) {
            return res.sendStatus(404);
        }
        return res.status(200).send(customers);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const { rows: checkCustomer } = await connection.query(`
        SELECT * FROM customers
        WHERE cpf = $1
        `, [cpf]);
        if (checkCustomer.length !== 0) {
            return res.sendStatus(409);
        }
        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [name, phone, cpf, birthday]);
        return res.sendStatus(201);  
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function editCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    console.log(req.body)
    try {
        const checkCustomer = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1
        `, [id]);
        if (!checkCustomer.rows[0]) {
            return res.sendStatus(404);
        }
        const editedCustomer = await connection.query(`
        UPDATE customers
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5
        `, [name, phone, cpf, birthday, id]);
        console.log(editedCustomer)
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}