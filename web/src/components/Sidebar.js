import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h2>Counselor Panel</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/students">Manage Students</Link>
        </li>
        <li>
          <Link to="/schedule">Weekly Schedule</Link>
        </li>
        <li>
          <Link to="/messages">Messages</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
