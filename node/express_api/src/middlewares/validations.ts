const joi = require("@hapi/joi")

function validate(data: any, schema: any) {
    const { error } = joi.object(schema).validate(data);
    return error;
}

export function validationHandler(schema: any, check: string = 'body') {
    return function(req: any, res: any, next: any) {
        const error = validate(req[check], schema);

        error ? next(error) : next();
    };
}