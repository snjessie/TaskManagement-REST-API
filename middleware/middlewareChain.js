// dependencies
const logger = require('./logger');
const cors = require('./cors');
const auth = require('./auth');

// middleware list (order matters)
const middlewares = [logger, cors, auth];

const runMiddlewares = (req, res, finalHandler) => {
    // eslint-disable-next-line prefer-const
    let index = 0;

    const next = () => {
        const currMiddleware = middlewares[index];

        if (currMiddleware) {
            index += 1;

            currMiddleware(req, res, next);
        } else {
            finalHandler(req, res);
        }
    };
    next();
};

module.exports = runMiddlewares;
