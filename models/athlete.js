let mongoose = require('mongoose');

// Athletes Schema
let athleteSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  league: {
    type: String,
    required: true
  },
  club: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

let Athlete = module.exports = mongoose.model('Athlete',athleteSchema);
