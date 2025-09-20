import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import './Homepage.scss';

import { 
  Typography, 
  Button, 
  Container, 
  Box
} from '@mui/material';
import { 
  LoginOutlined
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthProvider';

const HomePage: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Redirect to entries if user is already authenticated
    if (isAuthenticated) {
        return <Navigate to="/entries" replace />;
    }

    return (
        <Box className="homepage-container">
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box className="hero-section">
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        className="hero-title"
                        gutterBottom
                    >
                        Welcome to Reflectly
                    </Typography>
                    <Typography 
                        variant="h5" 
                        component="p" 
                        className="hero-subtitle"
                        gutterBottom
                    >
                        Your personal journey of self-discovery and growth
                    </Typography>
                    <Typography 
                        variant="body1" 
                        className="hero-description"
                        sx={{ mb: 4 }}
                    >
                        Track your daily reflections, mood, and gratitude to build a better understanding of yourself.
                    </Typography>
                    
                    <Button
                        component={Link}
                        to="/login"
                        variant="contained"
                        size="large"
                        startIcon={<LoginOutlined />}
                        className="cta-button"
                    >
                        Get Started
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;