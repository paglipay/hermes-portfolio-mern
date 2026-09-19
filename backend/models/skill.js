const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: String,
  level: String, // e.g., Beginner, Intermediate, Expert
  category: String, // e.g., Programming, Networking
});

module.exports = mongoose.model('Skill', SkillSchema);
