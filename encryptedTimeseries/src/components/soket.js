import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your socket server URL

function YourComponent() {
  const [successRate, setSuccessRate] = useState(0);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // Socket.IO event listener for 'dataStream'
    socket.on('dataStream', (dataStream) => {
        const messages = JSON.parse(dataStream);
        const totalMessages = messages.length;
        const successfulMessages = messages.filter((message) => message.success).length;
        const calculatedSuccessRate = (successfulMessages / totalMessages) * 100 || 0;
        
        // Debugging: Log the received messages and calculated success rate
        console.log(messages);
        console.log('Success Rate:', calculatedSuccessRate);
      
        setSuccessRate(calculatedSuccessRate);
        setDataList(messages);
      });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off('dataStream');
    };
  }, []); // Empty dependency array ensures the effect runs once after initial render

  // JSX to render your component UI with dataList and successRate state
  return (
    <div>
      <h2>Real-Time Data Display</h2>
      <ul>
        {dataList.map((message, index) => (
          <li key={index}>{message.encryptedMessage} - {message.success ? 'Success' : 'Failure'}</li>
        ))}
      </ul>
      <h2>Success Rate: {successRate.toFixed(2)}%</h2>
    </div>
  );
}

export default socket;
