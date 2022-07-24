import joi from "joi";

export default function postGamesSchema(object) {
    const imageRegex = /(http(s?):)([/|.|\w|\s|-])/;

    const validationSchema = joi.object().keys({
        name: joi.string().required(),
        image: joi.string().pattern(imageRegex).required(),
        stockTotal: joi.number().positive().required(),
        categoryId: joi.number().positive().required(),
        pricePerDay: joi.number().positive().required(),

    });
    const validation = validationSchema.validate(object, {abortEarly: false});
    return validation;
}