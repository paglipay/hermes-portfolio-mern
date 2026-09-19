const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  description: String,
});

module.exports = mongoose.model('Experience', ExperienceSchema);
