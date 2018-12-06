require('module-alias/register');

const mongoose = require("mongoose");
const Models = require('@models');

const faker = require('faker');
const config = require('@project_root/config');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const server = require('@root/app').httpServer;
const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const expect = chai.expect;

describe('Admin methods', () => {
    const admin = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    };
    let nonAdmin = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    };
    while (nonAdmin.email === admin.email) {
        nonAdmin.email = faker.internet.email().toLowerCase();
    }

    // Развертываем БД
    before(async () => {
        await mongoose.connect(
            config.DBHost,
            { useNewUrlParser: true }
        );
        await mongoose.connection.dropDatabase();
        await new Models.User({
            credentials: admin,
            isAdmin: true,
        }).save();
        await new Models.User({
            credentials: nonAdmin,
        }).save();

        // done();
    });

    describe('Create Job', () => {
        // Вспомогательная функция
        const createJob = () => {
            return {
                occupation: faker.name.jobType(),
                country: faker.address.country(),
                averageSalary: faker.random.number({
                    min: 100000,
                    max: 200000,
                }),
                monthlyExpenses: faker.random.number({
                    min: 1000,
                    max: 2000,
                }),
                ticketCost: faker.random.number({
                    min: 500,
                    max: 1000,
                }),
            };
        }

        // Только пользователь с правами админа может создавать новую профессию
        it('it should not create new job without admin rights', (done) => {
            const newJob = createJob();

            // Отправляем правильные почту и пароль
            let agent = chai.request.agent(server);

            agent.post('/api/user/auth/signin')
                .send(nonAdmin)
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.have.cookie('connect.sid');

                    // Делаем запрос на создание
                    agent.put('/api/admin/job/')
                        .send(newJob)
                        .then((res) => {
                            res.should.have.status(403);
                            agent.close();
                            done();
                        });
                });
        });

        it('it should be able to create new job', (done) => {
            const newJob = createJob();

            // Отправляем правильные почту и пароль
            let agent = chai.request.agent(server);

            agent.post('/api/user/auth/signin')
                .send(admin)
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.have.cookie('connect.sid');

                    // Делаем запрос на создание
                    agent.put('/api/admin/job/')
                        .send(newJob)
                        .then((res) => {
                            res.should.have.status(200);
                            agent.close();
                            done();
                        });
                });
        });
    });

    // Удаляем все из БД
    after((done) => {
        mongoose.connection.dropDatabase(() => {
            mongoose.disconnect();
            done();
        });
    });
});
