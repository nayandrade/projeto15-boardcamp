import joi from "joi";

export default function postRentSchema(object) {

    const validationSchema = joi.object().keys({
        customerId: joi.number().positive().required(),
        gameId: joi.number().positive().required(),
        daysRented: joi.number().positive().required(),

    });
    const validation = validationSchema.validate(object, {abortEarly: false});
    return validation;
}