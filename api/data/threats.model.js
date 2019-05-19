var mongoose = require('mongoose');


var threatSchema = new mongoose.Schema({
  'latitude' : Number,
  'longitude': Number
  }
);

mongoose.model('Threat', threatSchema, 'locations');