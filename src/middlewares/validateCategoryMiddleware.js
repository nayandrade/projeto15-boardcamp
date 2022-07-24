import postCategorySchema from '../schemas/postCategorySchema.js';

export default function validateCategoryMiddleware(req, res, next) {
    const { error } = postCategorySchema(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}