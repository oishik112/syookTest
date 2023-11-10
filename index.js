const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const listenerService = require('./listener');
const { emitterService } = require('./emitter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/syook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Initialize Emitter and Listener services
try {
  emitterService(io); // Pass the socket.io instance to the emitter service
} catch (error) {
  console.error('Error in emitterService:', error.message);
  // Handle the error, maybe exit the program or take appropriate action based on your use case
}
try {
  listenerService(io); // Pass the socket.io instance to the listener service
} catch (error) {
  console.error('Error in listenerService:', error.message);
  // Handle the error, maybe exit the program or take appropriate action based on your use case
}

app.get('/api/data', (req, res) => {
  // Handle the request and send a response
  res.json({ message: 'Backend is working!' });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
