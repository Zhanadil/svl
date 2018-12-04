require('module-alias/register');

require('dotenv').config();
const convict = require('convict');

// Все конфигурации которые ДОЛЖНЫ быть указаны, дефолтят к __ERROR__
// Перед запуском проверяем все конфигурации на это значение, и завершаем процесс
// если нашли хоть одну
const config = convict({
    env: {
        format: ['prod', 'dev', 'test'],
        default: 'dev',
        arg: 'nodeEnv',
        env: 'NODE_ENV',
    },
    DBHost: {
        format: String,
        default: '__FATAL__',
        arg: 'DBHost',
        env: 'DBHost',
    },
    httpPort: {
        format: 'int',
        default: 3000,
        arg: 'httpPort',
        env: 'HTTP_PORT',
    },
    logsDirectory: {
        format: String,
        default: '__FATAL__',
        arg: 'logsDirectory',
        env: 'LOGS_DIRECTORY',
    },
    sessionSecret: {
        format: String,
        default: 'default secret',
        arg: 'sessionSecret',
        env: 'SESSION_SECRET',
    },
});

const env = config.get('env');
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
