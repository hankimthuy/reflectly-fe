export const APP_ROUTES = {
    // Public routes
    LOGIN: '/login',
    WELCOME: '/',
    
    // Main routes
    HOME: '/home',
    ENTRIES: '/entries',
    PROFILE: '/profile',
} as const;

// Route paths for easy access
export const ROUTE_PATHS = {
    ...APP_ROUTES,
} as const;