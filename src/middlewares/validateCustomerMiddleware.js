import postCustomerSchema from "../schemas/postCustomerSchema.js";
import connection from "../database/database.js";

export async function validateCustomerMiddleware(req, res, next) {
    const { cpf } = req.body;
    const { error } = postCustomerSchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { rows: checkCustomer } = await connection.query(`
        SELECT * FROM customers
        WHERE cpf = $1
        `, [cpf]);
        if (checkCustomer.length !== 0) {
            return res.sendStatus(409);
        } 
    } catch (error) {
       console.error(error);
       res.sendStatus(500); 
    }
    next();
}

export async function validateEditCustomerMiddleware(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params;

    const { error } = postCustomerSchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const { rows: checkCustomer } = await connection.query(`
        SELECT * FROM customers
        WHERE cpf = $1
        AND id != $2
        `, [cpf, id]);
        if (checkCustomer.length !== 0) {
            return res.sendStatus(409);
        } 
    } catch (error) {
       console.error(error);
       res.sendStatus(500); 
    }
    next();
}