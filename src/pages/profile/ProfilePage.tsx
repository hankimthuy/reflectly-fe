import React from 'react';
import {useAuth} from '../../providers/AuthProvider';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
    const {currentUser} = useAuth();

    if (!currentUser) {
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
                        {currentUser.pictureUrl ? (
                            <img
                                src={currentUser.pictureUrl}
                                alt={`Avatar of ${currentUser.fullName}`}
                                className="avatar-image"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {currentUser.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h1 className="profile-name">{currentUser.fullName}</h1>
                    <p className="profile-email">{currentUser.email}</p>
                </div>

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>Personal Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Full Name</label>
                                <span>{currentUser.fullName}</span>
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <span>{currentUser.email}</span>
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
