const { sendError } = require('../middleware/resFormatter');

const notFound = (req, res, message) => {
    const errorMessage = message || 'Route not found';
    sendError(res, 404, errorMessage);
};

const methodNotAllowed = (req, res, allowedMethods) => {
    sendError(res, 405, {
        error: 'Method not allowed',
        allowed: allowedMethods,
    });
};

const badRequest = (res, errors) => {
    sendError(res, 400, errors);
};

const unauthorized = (res) => {
    sendError(res, 401, {
        error: 'Invalid or missing API key',
    });
};

const conflict = (res, message) => {
    sendError(res, 409, {
        error: message,
    });
};

const internalServerError = (res) => {
    sendError(res, 500, {
        error: 'Internal Server Error',
    });
};

module.exports = {
    notFound,
    methodNotAllowed,
    badRequest,
    unauthorized,
    conflict,
    internalServerError,
};
