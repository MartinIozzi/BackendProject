export default class CustomErrors {
    static createError(name, cause, message, status = 1) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = status;
        error.cause = cause;
        throw error;
    };
};
