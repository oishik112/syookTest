// DataList.js
import React from 'react';

const DataList = ({ data }) => {
  console.log('Data in DataList:', data);

  return (
    <div>
      <h2>Data List</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <strong>Name:</strong> {item.name},&nbsp;
            <strong>Origin:</strong> {item.origin},&nbsp;
            <strong>Destination:</strong> {item.destination},&nbsp;
            <strong>Success:</strong> {item.success ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
