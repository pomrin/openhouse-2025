import React from 'react';

function NoAccess() {
  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }} />
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginY: 'auto' }}>
        <h2>Access Denied</h2>
        <p>You do not have access to this page.</p>
      </span>
    </div>
  );
}

export default NoAccess;
