const url = require('url');

const parseRequest = (req) => {
    const parsedUrl = url.parse(req.url, true);

    return {
        pathname: parsedUrl.pathname.replace(/\/+$/, ''),
        query: parsedUrl.query,
        method: req.method.toUpperCase(),
    };
};

// Body-Parser
const parseBody = (req) =>
    new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('Invalid JSON'));
            }
        });
    });

module.exports = { parseRequest, parseBody };
