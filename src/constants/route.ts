export const APP_ROUTES = {
    // Public
    LOGIN: '/login',
    SIGNUP: '/signup',
    WELCOME: '/',

    // Main
    HOME: '/home',
    ENTRIES: '/entries',
    PROFILE: '/profile',
    ENTRIES_LIST: '/entries/list',
    ENTRIES_NEW: '/entries/new',
    ENTRIES_EDIT: '/entries/edit/:id',

    // Coach / Relationship Map pivot
    ONBOARDING: '/onboarding',
    COACH_CHAT: '/coach',
    COACH_HISTORY: '/coach/history',
    COACH_HISTORY_DETAIL: '/coach/history/:id',
    DASHBOARD: '/dashboard',

    // Aura redesign: "Reflect" is the one hub for People / Mirror / Timeline / Journal —
    // DASHBOARD and ENTRIES_LIST above now redirect here (see AppRoutes) rather than being
    // deleted outright, so old links/bookmarks still land somewhere sensible.
    REFLECT: '/reflect',
};

export type ReflectTab = 'people' | 'mirror' | 'timeline' | 'journal';

export const REFLECT_TABS: ReflectTab[] = ['people', 'mirror', 'timeline', 'journal'];

export const reflectTabPath = (tab: ReflectTab) => `${APP_ROUTES.REFLECT}/${tab}`;
