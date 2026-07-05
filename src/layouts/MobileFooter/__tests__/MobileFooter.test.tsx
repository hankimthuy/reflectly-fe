import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileFooter from '../MobileFooter';

vi.mock('../../../providers/AuthProvider', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        isLoading: false,
        currentUser: null,
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

const mockSetMobileTab = vi.fn();
let mockMobileTab = 'split';

vi.mock('../../../providers/ThemeContext', () => ({
    useTheme: () => ({
        mobileTab: mockMobileTab,
        setMobileTab: mockSetMobileTab,
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('../../../components/ConfirmDialog/ConfirmDialog', () => ({
    default: () => null,
}));

vi.mock('@mui/material', () => ({
    Box: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    IconButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <button className={className}>{children}</button>
    ),
}));

vi.mock('@mui/icons-material/Add', () => ({
    default: () => <span data-testid="icon-add">Add</span>,
}));

const renderWithRouter = (initialPath: string, mobileTab = 'split') => {
    mockMobileTab = mobileTab;
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <MobileFooter />
        </MemoryRouter>
    );
};

describe('MobileFooter', () => {
    describe('rendering', () => {
        it('should render all navigation items', () => {
            renderWithRouter('/');

            expect(screen.getByRole('button', { name: 'Inner' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Entries' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Outer' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Me' })).toBeInTheDocument();
            expect(document.querySelector('.mobile-footer__fab')).toBeInTheDocument();
        });

        it('should render the FAB (add) button with correct class', () => {
            renderWithRouter('/');

            expect(document.querySelector('.mobile-footer__fab')).toBeInTheDocument();
        });
    });

    describe('active state', () => {
        it('should mark entries as active when on /entries/list', () => {
            renderWithRouter('/entries/list');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Entries');
        });

        it('should mark inner tab as active when mobileTab is inner', () => {
            renderWithRouter('/', 'inner');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Inner');
        });

        it('should mark outer tab as active when mobileTab is outer', () => {
            renderWithRouter('/', 'outer');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Outer');
        });

        it('should mark profile as active when on /profile', () => {
            renderWithRouter('/profile');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Me');
        });

        it('should NOT mark any item as active on unrelated path', () => {
            renderWithRouter('/login');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });

        it('should NOT mark any item as active on landing page (/) with split tab', () => {
            renderWithRouter('/');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });
    });

    describe('regression: single active item', () => {
        it('should only have one active item at a time', () => {
            renderWithRouter('/entries/list');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
        });

        it('should not show active state on /login', () => {
            renderWithRouter('/login');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });
    });
});
