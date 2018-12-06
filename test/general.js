require('module-alias/register');

const mongoose = require("mongoose");
const Models = require('@models');
const helpers = require('@test/helpers');

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

describe('General requests', () => {
    let job1 = helpers.createJob();
    let job2 = helpers.createJob();
    let job3 = helpers.createJob();

    while (job2.occupation === job1.occupation) {
        job2.occupation = faker.name.jobType();
    }
    job3.occupation = job2.occupation;

    // Развертываем БД
    before(async () => {
        await mongoose.connect(
            config.DBHost,
            { useNewUrlParser: true }
        );
        await mongoose.connection.dropDatabase();
        await new Models.Job(job1).save();
        await new Models.Job(job2).save();
        await new Models.Job(job3).save();
    });

    describe('Get Occupations', () => {
        it('it should get occupations', (done) => {
            chai.request(server)
                .get('/api/general/occupations')
                .end((err, res) => {
                    expect(err).to.be.null;
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.should.deep.include({
                        _id: job1.occupation,
                        count: 1,
                    });
                    res.body.should.deep.include({
                        _id: job2.occupation,
                        count: 2,
                    });

                    done();
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
