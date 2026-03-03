// dependencies
const http = require('http');
const { handleReqRes } = require('./routes/router');
const runMiddlewares = require('./middleware/middlewareChain');

// app object - module scaffolding
const app = {};

app.config = {
    port: 3000,
};

app.createServer = () => {
    const server = http.createServer((req, res) => {
        console.log(`Incoming Request: ${req.method} ${req.url}`);
        runMiddlewares(req, res, handleReqRes);
    });

    server.listen(app.config.port, () => {
        console.log(`Server is listening on port ${app.config.port}`);
    });
};

app.createServer();
