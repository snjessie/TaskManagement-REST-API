// dependencies
const http = require('http');
const { handleReqRes } = require('./routes/router');

// app object - module scaffolding
const app = {};

app.config = {
    port: 3000,
};

app.createServer = () => {
    const server = http.createServer((handleReqRes) => {});

    server.listen(app.config.port, () => {
        console.log(`Server is listening on port ${app.config.port}`);
    });
};

app.createServer();
