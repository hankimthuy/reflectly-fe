import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.pictureUrl ? (
              <img
                src={user.pictureUrl}
                alt={`Avatar of ${user.fullName}`}
                className="avatar-image"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="avatar-placeholder">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="profile-name">{user.fullName}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <span>{user.fullName}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Total Entries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Days Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Reflections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
