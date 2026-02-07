import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileFooter from '../MobileFooter';

// Mock MUI components to avoid heavy rendering
vi.mock('@mui/material', () => ({
    Box: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    IconButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <button className={className}>{children}</button>
    ),
}));

vi.mock('@mui/icons-material/HomeOutlined', () => ({
    default: () => <span data-testid="icon-home">Home</span>,
}));
vi.mock('@mui/icons-material/FormatQuote', () => ({
    default: () => <span data-testid="icon-quotes">Quotes</span>,
}));
vi.mock('@mui/icons-material/Add', () => ({
    default: () => <span data-testid="icon-add">Add</span>,
}));
vi.mock('@mui/icons-material/Insights', () => ({
    default: () => <span data-testid="icon-stats">Stats</span>,
}));
vi.mock('@mui/icons-material/List', () => ({
    default: () => <span data-testid="icon-entries">Entries</span>,
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
            renderWithRouter('/home');

            const links = screen.getAllByRole('link');
            // 5 nav items: home, quotes, add (fab), statistics, entries
            expect(links.length).toBe(5);
        });

        it('should render the FAB (add) button with correct class', () => {
            renderWithRouter('/home');

            const fabLink = screen.getAllByRole('link').find(
                (link: HTMLElement) => link.classList.contains('mobile-footer__fab')
            );
            expect(fabLink).toBeDefined();
        });
    });

    describe('active state based on location.pathname only', () => {
        it('should mark /home as active when on /home', () => {
            renderWithRouter('/home');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);

            // The active link should point to /home
            const activeLink = activeItems[0] as HTMLAnchorElement;
            expect(activeLink.getAttribute('href')).toBe('/home');
        });

        it('should mark /quotes as active when on /quotes', () => {
            renderWithRouter('/quotes');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);

            const activeLink = activeItems[0] as HTMLAnchorElement;
            expect(activeLink.getAttribute('href')).toBe('/quotes');
        });

        it('should mark /statistics as active when on /statistics', () => {
            renderWithRouter('/statistics');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);

            const activeLink = activeItems[0] as HTMLAnchorElement;
            expect(activeLink.getAttribute('href')).toBe('/statistics');
        });

        it('should mark /entries/list as active when on /entries/list', () => {
            renderWithRouter('/entries/list');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);

            const activeLink = activeItems[0] as HTMLAnchorElement;
            expect(activeLink.getAttribute('href')).toBe('/entries/list');
        });

        it('should NOT mark any item as active on unrelated path', () => {
            renderWithRouter('/login');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });

        it('should NOT mark any item as active on landing page (/)', () => {
            renderWithRouter('/');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });
    });

    describe('active indicator', () => {
        it('should show indicator dot only for the active item', () => {
            renderWithRouter('/home');

            const indicators = document.querySelectorAll('.mobile-footer__indicator');
            expect(indicators.length).toBe(1);
        });

        it('should NOT show indicator when no item is active', () => {
            renderWithRouter('/some-random-page');

            const indicators = document.querySelectorAll('.mobile-footer__indicator');
            expect(indicators.length).toBe(0);
        });
    });

    describe('navigation links', () => {
        it('should have correct href for each nav item', () => {
            renderWithRouter('/home');

            const links = screen.getAllByRole('link');
            const hrefs = links.map((link: HTMLElement) => link.getAttribute('href'));

            expect(hrefs).toContain('/home');
            expect(hrefs).toContain('/quotes');
            expect(hrefs).toContain('/entries/new');
            expect(hrefs).toContain('/statistics');
            expect(hrefs).toContain('/entries/list');
        });
    });

    describe('regression: no stale navIndex state', () => {
        it('should only have one active item at a time regardless of navigation history', () => {
            // This tests the fix: previously navIndex state could cause
            // multiple items to appear active simultaneously
            renderWithRouter('/statistics');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(1);
            expect((activeItems[0] as HTMLAnchorElement).getAttribute('href')).toBe('/statistics');
        });

        it('should not show active state for /home when on /login (regression)', () => {
            // Previously, navIndex defaulted to 0 (home) even on /login,
            // causing home to appear active via the || condition
            renderWithRouter('/login');

            const activeItems = document.querySelectorAll('.mobile-footer__item--active');
            expect(activeItems.length).toBe(0);
        });
    });
});
