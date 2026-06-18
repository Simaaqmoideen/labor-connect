import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  
  return (
    <span className={`badge badge-${normalizedStatus}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
