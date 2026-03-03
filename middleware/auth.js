const { sendError } = require('./resFormatter');

function auth(req, res, next) {
    // Tddo: Health checking

    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== '12345') {
        return sendError(res, 401, {
            error: 'Invalid or missing API key',
        });
    }

    next();
}

module.exports = auth;
