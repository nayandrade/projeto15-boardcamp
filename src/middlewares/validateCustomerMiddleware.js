import postCustomerSchema from "../schemas/postCustomerSchema.js";

export default function validateCustomerMiddleware(req, res, next) {
    const { error } = postCustomerSchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}