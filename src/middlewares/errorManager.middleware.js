import errorsType from "../utils/errors.js";

export default (err, req, res, next) => {
    console.log(err, 'errorManager')
    switch (err.code) {

        case errorsType.INVALID_TYPE:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.ROUTING_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.DATABASE_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.AUTHENTICATION_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.PRODUCTS_ERROR:
            res.status(401).send({ status: "error", error: err.name });
            break;
        case errorsType.USER_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.CART_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.REGISTER_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.LOGIN_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.DELOGIN_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.NOPERMISSIONS_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.RENDER_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        case errorsType.TICKET_ERROR:
            res.status(400).send({ status: "error", error: err.name });
            break;
        default:
            res.status(500).send({ status: "error", error: "Internal Server Error" });
            break;
    }
};