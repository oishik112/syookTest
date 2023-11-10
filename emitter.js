// emitter.js
const io = require('socket.io-client');
const crypto = require('crypto');
const data = require('./data.json');


const socket = io('http://localhost:3001'); // Replace with the correct socket server URL

function generateSecretKey(name, origin, destination) {
  const secret = `${name}-${origin}-${destination}`;
  return crypto.createHash('sha256').update(secret).digest('hex');
}

function generateEncryptedMessage(name, origin, destination) {
  const secret_key = generateSecretKey(name, origin, destination);
  const payload = {
    name,
    origin,
    destination,
    secret_key,
  };
  const passKey = 'R$7&zLp2Qy9@uFhS'; // AES encryption pass key
  const cipher = crypto.createCipher('aes-256-ctr', passKey);
  let encryptedMessage = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');
  return encryptedMessage;
}

function generateDataStream() {
  const numberOfMessages = Math.floor(Math.random() * (500 - 49 + 1) + 49);
  const messages = [];
  for (let i = 0; i < numberOfMessages; i++) {
    const name = data.names[Math.floor(Math.random() * data.names.length)];
    const origin = data.cities[Math.floor(Math.random() * data.cities.length)];
    const destination = data.cities[Math.floor(Math.random() * data.cities.length)];
    const encryptedMessage = generateEncryptedMessage(name, origin, destination);
    messages.push(encryptedMessage);
  }
  const dataStream = messages.join('|');
  socket.emit('dataStream', dataStream); // Emit the data stream to the Listener
}
// Inside your emitterService function
function generateDataStream() {
    const numberOfMessages = Math.floor(Math.random() * (500 - 49 + 1) + 49);
    const messages = [];
    for (let i = 0; i < numberOfMessages; i++) {
      const name = data.names[Math.floor(Math.random() * data.names.length)];
      const origin = data.cities[Math.floor(Math.random() * data.cities.length)];
      const destination = data.cities[Math.floor(Math.random() * data.cities.length)];
      const encryptedMessage = generateEncryptedMessage(name, origin, destination);
      const success = Math.random() < 0.8; // Simulate an 80% success rate
      messages.push({ encryptedMessage, success });
    }
    socket.emit('dataStream', JSON.stringify(messages)); // Emit the data stream to the Listener
  }

setInterval(generateDataStream, 10000); // Generate and emit data stream every 10s
