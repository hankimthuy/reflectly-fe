import React from 'react';
import './EntriesListPage.scss';

const EntriesPage: React.FC = () => {
  return (
    <div className="main-content">
      <div className="entries-list-frame">
        <h2 className="entries-list-title">Your Entries</h2>
        <div className="entries-list-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Total Days Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Reflections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;