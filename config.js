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
        env: 'NODE_ENV'
    },
    httpPort: {
        format: 'int',
        default: 3000,
        arg: 'httpPort',
        env: 'HTTP_PORT'
    },
    logsDirectory: {
        format: String,
        default: '__ERROR__',
        arg: 'logsDirectory',
        env: 'LOGS_DIRECTORY'
    },
});

const env = config.get('env');
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: 'strict' });

module.exports = config.getProperties();
