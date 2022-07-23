import connection from '../database/database.js';

export async function getCategories(req, res) {
    try {
        const categories = await connection.query(`
        SELECT * 
        FROM categories
        `)
        return res.status(200).send(categories.rows)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)        
    }
}

export async function postCategory(req, res) {
    const { name: categoryName } = req.body;
    console.log(categoryName)
    if(!categoryName) {
        return res.sendStatus(400)
    }
    try {
        const checkCategory = await connection.query(`
        SELECT *
        FROM categories
        `)
        const categoryExists = checkCategory.rows.find(category => category.name === categoryName)
        console.log(categoryExists)
        if(categoryExists) {
            return res.sendStatus(409)
        }
        const newCategory = await connection.query(`
        INSERT INTO categories (name)
        VALUES ($1)
        `,[categoryName])
        console.log(newCategory)     
        return res.sendStatus(201)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}