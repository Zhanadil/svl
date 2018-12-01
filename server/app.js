const express = require('express');
const body_parser = require('body-parser');
const http = require('http');
const https = require('https');
const ip = require('ip');

const router = require('@routes');

class App {
    constructor() {
        // TODO: Добавить файлы конфигураций
        this.env = process.env.NODE_ENV;
        this.httpPort = process.env.HTTP_PORT || 3000;
        this.port = process.env.PORT || 3443;
        this.host = process.env.HOST || ip.address();

        // TODO: Добавить сертификаты ssl
        // this.privateKey = fs.readFileSync(__PRIVATEKEY_FILE__, 'utf8');
        // this.certificate = fs.readFileSync(__CERTIFICATE_FILE__, 'utf8');
        // this.sslCredentials = {
        //     key: this.privateKey,
        //     cert: this.certificate
        // };

        this.express = express();
        this.httpServer = http.createServer(this.express);
        // this.server = https.createServer(this.sslCredentials, this.express);

        this.applyRouters(this.express);
    }

    applyRouters(express) {
        if (!express) {
            // TODO: Лог
            return;
        }

        // Подключаем нужные нам миддлы
        express.use(body_parser.json());

        // Подключаем роутеры
        express.use('/api', router);

        // Обработка 404
        express.use((req, res, next) => {
            return res.status(404).send('sorry, page not found');
        });

        // Обработка ошибок
        express.use((err, req, res, next) => {
            // TODO: log this.
            return res.status(err.status || 500).json({
                error: err.message
            });
        });
    }
}

module.exports = new App();
