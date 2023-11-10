// mongoose.js
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// MongoDB connection URI with the database name 'syook'
const dbURI = 'mongodb://localhost:27017/syook';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// Close the Mongoose connection if the Node process ends
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// Define the schema and model for your data
const dataSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  secret_key: String,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = {
  mongoose,
  Data,
};
