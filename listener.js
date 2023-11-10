// listener.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/timeseriesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  secret_key: String,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

io.on('connection', (socket) => {
  socket.on('dataStream', (dataStream) => {
    const encryptedMessages = dataStream.split('|');
    encryptedMessages.forEach((encryptedMessage) => {
      const passKey = 'your_secret_pass_key'; // AES decryption pass key
      const decipher = crypto.createDecipher('aes-256-ctr', passKey);
      let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
      decryptedMessage += decipher.final('utf8');

      try {
        const payload = JSON.parse(decryptedMessage);
        // Validate the payload using secret_key (implement this logic)
        // If validation successful, save the data to MongoDB with timestamp
        const { name, origin, destination, secret_key } = payload;
        const newData = new Data({ name, origin, destination, secret_key });
        newData.save();
      } catch (error) {
        console.error('Invalid message:', decryptedMessage);
      }
    });
  });
});

server.listen(3001, () => {
  console.log('Listener service is running on port 3001');
});
