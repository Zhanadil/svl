const mongoose = require('mongoose');
const config = require('@project_root/config');

// Схема информации о профессии
const jobSchema = mongoose.Schema({
    occupation: String,
    country: String,
    averageSalary: Number,
    monthlyExpenses: Number,
    ticketCost: Number,
});

module.exports = jobSchema;
