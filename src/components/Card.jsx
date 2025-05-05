// src/components/Card.jsx
import React from 'react';

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    {children}
  </div>
);

export default Card;
