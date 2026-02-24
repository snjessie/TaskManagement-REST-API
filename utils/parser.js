const url = require('url');

const parseRequest = (req) => {
    const parsedUrl = url.parse(req.url, true);

    return {
        pathname: parsedUrl.pathname.replace(/\/+$/, ''),
        query: parsedUrl.query,
        method: req.method.toUpperCase(),
    };
};

module.exports = parseRequest;
