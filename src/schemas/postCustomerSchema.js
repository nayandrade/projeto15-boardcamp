import joi from "joi";

export default function postCustomerSchema(object) {
    const phoneRegex = /^[0-9]{2}[0-9]{4,5}[0-9]{4}$/;
    const cpfRegex = /^[0-9]{11}$/;
    //const birthdayRegex = /(?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[012])[-/.](?:19\d{2}|20[01][0-9]|2020)/

    const validationSchema = joi.object().keys({
        name: joi.string().required(),
        phone: joi.string().pattern(phoneRegex).required(),
        cpf: joi.string().pattern(cpfRegex).required(),
        birthday: joi.date().less('now'),
    });

    const validation = validationSchema.validate(object, {abortEarly: false});
    return validation;
}