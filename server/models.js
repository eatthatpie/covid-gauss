const env = require('./env');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://' + env.mongo.host + '/' + env.mongo.dbname,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const Country = new mongoose.model('Country', new mongoose.Schema({
  name: String,
  province_name: String,
  slug: String,
  lat: Number,
  lng: Number
}));

const DailyReport = new mongoose.model('DailyReport', new mongoose.Schema({
  country_slug: String,
  date: String,
  date_obj: Date,
  new_infected: Number,
  total_infected: Number,
  new_dead: Number,
  total_dead: Number,
  new_recovered: Number,
  total_recovered: Number
}));

module.exports = { Country, DailyReport };
