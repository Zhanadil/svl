const mongoose = require('mongoose');

const jobSchema = require('@models/schemas/job');

const job = mongoose.model('job', jobSchema);

module.exports = job;
