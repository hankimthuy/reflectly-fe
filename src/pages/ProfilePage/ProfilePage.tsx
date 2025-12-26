import React from 'react';
import {useAuth} from '../../providers/AuthProvider';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
    const {currentUser} = useAuth();

    if (!currentUser) {
        return (
            <div className="main-content">
                <div className="profile-frame">
                    <div className="profile-container">
                        <p>Please log in to view your profile.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="profile-frame">
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
                </div>

                <div className="profile-content">
                    <div className="profile-section">
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
                </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
