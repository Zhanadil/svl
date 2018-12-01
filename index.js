require('module-alias/register');

const app = require('@root/app');

app.httpServer.listen(app.httpPort);
console.log(`Server started on: http://${app.host}:${app.httpPort}`);

// app.server.listen(app.port);
// console.log(`Secured server started on: https://${app.host}:${app.port}`);
