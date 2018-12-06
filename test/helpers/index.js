const faker = require('faker');

module.exports = {

createJob: () => {
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
},

};
