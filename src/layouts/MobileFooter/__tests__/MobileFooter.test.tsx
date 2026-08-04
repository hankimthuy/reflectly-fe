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

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const labels: Record<string, string> = {
                'mobileFooter.coach': 'Coach',
                'mobileFooter.dashboard': 'Bảng thông tin',
                'mobileFooter.journal': 'Nhật ký',
                'mobileFooter.profile': 'Tôi',
            };
            return labels[key] ?? key;
        },
    }),
}));

vi.mock('../../../components/ConfirmDialog/ConfirmDialog', () => ({
    default: () => null,
}));

vi.mock('@mui/material', () => ({
    Box: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    IconButton: ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
        <button className={className} onClick={onClick}>{children}</button>
    ),
}));

vi.mock('@mui/icons-material/ChatBubbleOutline', () => ({
    default: () => <span data-testid="icon-fab">Chat</span>,
}));

const renderWithRouter = (initialPath: string) => {
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

            expect(screen.getByRole('button', { name: 'Coach' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Bảng thông tin' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Nhật ký' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Tôi' })).toBeInTheDocument();
            expect(document.querySelector('.mobile-footer__fab')).toBeInTheDocument();
        });

        it('should render exactly one button for the FAB (no nested buttons)', () => {
            renderWithRouter('/');

            const fab = document.querySelector('.mobile-footer__fab');
            expect(fab?.tagName).toBe('BUTTON');
            expect(fab?.querySelectorAll('button').length).toBe(0);
        });
    });

    describe('active state', () => {
        it('should mark entries as active when on /entries/list', () => {
            renderWithRouter('/entries/list');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Nhật ký');
        });

        it('should mark dashboard as active when on /dashboard', () => {
            renderWithRouter('/dashboard');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Bảng thông tin');
        });

        it('should mark coach as active when on /coach', () => {
            renderWithRouter('/coach');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Coach');
        });

        it('should mark profile as active when on /profile', () => {
            renderWithRouter('/profile');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect(activeItems[0].textContent).toContain('Tôi');
        });

        it('should NOT mark any item as active on unrelated path', () => {
            renderWithRouter('/login');

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
