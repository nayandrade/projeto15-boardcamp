import connection from "../database/database.js";

export async function getCustomers(req, res) {
    try {
        const customers = await connection.query(`
        SELECT * FROM customers
        `);
        return res.status(200).send(customers.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1
        `, [id]);
        return res.status(200).send(customer.rows[0]);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const checkCustomer = await connection.query(`
        SELECT * FROM customers
        WHERE name = $1
        `, [name]);
        const customerExists = checkCustomer.rows.find(customer => customer.name === name);
        if (customerExists) {
            return res.sendStatus(409);
        }
        const newCustomer = await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [name, phone, cpf, birthday]);
        return res.status(201).send(newCustomer.rows[0]);
        
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