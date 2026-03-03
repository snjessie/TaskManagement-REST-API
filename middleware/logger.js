const fs = require('fs');
const path = require('path');

function logger(req, res, next) {
    const start = Date.now();
    const timeStamp = new Date().toISOString();

    res.on('finish', () => {
        const timeTaken = Date.now() - start;

        // Creating json object
        const logEntry = {
            timeStamp,
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: `${timeTaken}ms`,
        };
        // Convert object to string
        const logLine = `${JSON.stringify(logEntry)}\n`;

        // AppLog file creation
        const appLogPath = path.join(__dirname, '../data/appLog.json');

        fs.appendFile(appLogPath, logLine, (err) => {
            if (err) {
                console.error(`Error writing to ${appLogPath}:`, err.message);
            }
        });
    });
    next();
}

module.exports = logger;
