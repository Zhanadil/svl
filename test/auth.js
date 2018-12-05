require('module-alias/register');

const mongoose = require("mongoose");
const User = require('@models/user');

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

describe('User authorization methods', () => {
    const newUser = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    };
    let unexistingUser = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    };
    while (unexistingUser.email === newUser.email) {
        unexistingUser.email = faker.internet.email().toLowerCase();
    }

    // Развертываем БД
    before((done) => {
        mongoose.connect(
            config.DBHost,
            { useNewUrlParser: true }
        );
        mongoose.connection.dropDatabase(() => {
            done();
        });
    });

    describe('SignUp', () => {
        it('it should be able to sign up', (done) => {
            chai.request(server)
                .post('/api/user/auth/signup')
                .send(newUser)
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.should.have.cookie('connect.sid');
                    done();
                });
        });
    });

    describe('SignIn', () => {
        // Отправляем почту и пароль не существующего юзера
        it('it should sign in only existing user', (done) => {
            chai.request(server)
                .post('/api/user/auth/signin')
                .send(unexistingUser)
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(403);
                    res.should.have.property('text');
                    expect(res.text).to.be.eql('User not found');
                    done();
                });
        });

        // Чтобы проверить вход по почте, мы сначала заходим
        // А затем делаем запрос, требующий куки
        it('it should be able to sign in', (done) => {
            // Отправляем правильные почту и пароль
            let agent = chai.request.agent(server);

            agent.post('/api/user/auth/signin')
                .send(newUser)
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.have.cookie('connect.sid');

                    // Делаем запрос профиля
                    agent.get('/api/user/profile/')
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
