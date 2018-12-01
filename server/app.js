const express = require('express');
const body_parser = require('body-parser');
const http = require('http');
const https = require('https');
const ip = require('ip');
const mkdirp = require('mkdirp');
const fs = require('fs');

const router = require('@routes');

const config = require('@project_root/config');
const logger = require('@lib/logger').generalLogger;

class App {
    constructor() {
        let configError = this.checkConfigs();
        if (configError) {
            console.log(configError);
            process.exit(2);
        }

        this.env = config.env;
        this.httpPort = config.httpPort || 3000;
        this.port = process.env.PORT || 3443;
        this.host = process.env.HOST || ip.address();

        // TODO: Добавить сертификаты ssl
        // this.privateKey = fs.readFileSync(__PRIVATEKEY_FILE__, 'utf8');
        // this.certificate = fs.readFileSync(__CERTIFICATE_FILE__, 'utf8');
        // this.sslCredentials = {
        //     key: this.privateKey,
        //     cert: this.certificate
        // };

        // Создаем папки с логами и ресурсами если их нет.
        this.ensureDirectories();

        this.express = express();
        this.httpServer = http.createServer(this.express);
        // this.server = https.createServer(this.sslCredentials, this.express);

        this.applyRouters(this.express);
    }

    // Проверяем, что все конфигурации верны
    checkConfigs() {
        if (config.logsDirectory === '__ERROR__') {
            return 'Logs directory path has not been declared';
        }

        return null;
    }

    // Проверяет директории, если не существуют пытается создать
    ensureDirectories() {
        try {
            // Рекурсивно создаем папку с логами
            let ldir = mkdirp.sync(config.logsDirectory);
            // Проверяем на действительность
            let stats = fs.statSync(config.logsDirectory)
        } catch(err) {
            logger.fatal({
                error: err,
                message: 'Could not create directories',
            })
            // Не запускаем сервер без логгера
            process.exit(3);
        }
    }

    applyRouters(express) {
        if (!express) {
            logger.error('Could not apply routers');
            process.exit(4);
        }

        // Подключаем нужные нам миддлы
        express.use(body_parser.json());

        // Логгер обязательно должен быть вызван после создания папок с логами
        // Иначе может крашнуться.
        express.use(require('@root/lib/logger').expressLogger);

        // Подключаем роутеры
        express.use('/api', router);

        // Обработка 404
        express.use((req, res, next) => {
            return res.status(404).send('sorry, page not found');
        });

        // Обработка ошибок
        express.use((err, req, res, next) => {
            req.log.error(err.message);

            return res.status(err.status || 500).json({
                error: err.message
            });
        });
    }
}

module.exports = new App();
