import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import DataList from './components/DataList';
import SuccessRate from './components/SuccessRate';

const socket = io('http://localhost:3001');

const App = () => {
  const [data, setData] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    socket.on('data', (message) => {
      const parsedData = JSON.parse(message);
      setData(parsedData);

      const successItems = parsedData.filter((item) => item.success).length;
      setSuccessCount(successItems);
      setTotalCount(parsedData.length);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const successRate = totalCount === 0 ? 0 : ((successCount / totalCount) * 100).toFixed(2);

  return (
    <div className="app-container">
      <header>
        <nav>
          <div className="navbar">
            <h1>Real-Time Data Display</h1>
          </div>
        </nav>
      </header>

      <main>
        <div className="main-content">
          <DataList data={data} />
          <SuccessRate successRate={successRate} />
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p>&copy; By Oishik Dutta - A Syook Project</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
