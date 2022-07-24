import joi from "joi";

export default function postCategorySchema(object) {
    const validationSchema = joi.object().keys({
        name: joi.string().required()
    });
    const validation = validationSchema.validate(object);
    return validation;
}