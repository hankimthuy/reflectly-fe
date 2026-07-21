import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtocolsPage from '../ProtocolsPage';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, unknown>) => {
            const labels: Record<string, string> = {
                'actionProtocol.list.title': 'Action Protocols',
                'actionProtocol.list.subtitle': 'Your coping scripts, ready when you need them.',
                'actionProtocol.list.createButton': 'New protocol',
                'actionProtocol.list.empty': 'No protocols yet.',
                'breadcrumb.home': 'Home',
                'zonePage.backToGarden': 'Back to garden',
                'nav.login': 'Log in',
                'profilePage.loginRequired': 'Please log in.',
            };
            if (key === 'actionProtocol.list.usageCount') return `Used ${opts?.times} times`;
            return labels[key] ?? key;
        },
    }),
}));

vi.mock('../../../components/ConfirmDialog/ConfirmDialog', () => ({ default: () => null }));
vi.mock('../../../components/ProtocolFormDialog/ProtocolFormDialog', () => ({ default: () => null }));
vi.mock('../../../components/MarkProtocolUsedDialog/MarkProtocolUsedDialog', () => ({ default: () => null }));

const mockUseAuth = vi.fn();
vi.mock('../../../providers/AuthProvider', () => ({
    useAuth: () => mockUseAuth(),
}));

const mockUseSnackbar = vi.fn(() => ({ showSnackbar: vi.fn() }));
vi.mock('../../../providers/SnackbarProvider', () => ({
    useSnackbar: () => mockUseSnackbar(),
}));

const mockUseActionProtocolsInfiniteQuery = vi.fn();
const mockUseDeleteActionProtocolMutation = vi.fn(() => ({ mutate: vi.fn(), isPending: false }));
vi.mock('../../../queries/actionProtocolQueryHook', () => ({
    useActionProtocolsInfiniteQuery: () => mockUseActionProtocolsInfiniteQuery(),
    useDeleteActionProtocolMutation: () => mockUseDeleteActionProtocolMutation(),
}));

const renderPage = () => render(
    <MemoryRouter>
        <ProtocolsPage />
    </MemoryRouter>
);

describe('ProtocolsPage', () => {
    it('shows a login prompt when not authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false });
        mockUseActionProtocolsInfiniteQuery.mockReturnValue({
            data: undefined, isLoading: false, hasNextPage: false, isFetchingNextPage: false, fetchNextPage: vi.fn(),
        });

        renderPage();

        expect(screen.getByText('Please log in.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    });

    it('shows the empty state when authenticated with no protocols', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });
        mockUseActionProtocolsInfiniteQuery.mockReturnValue({
            data: { pages: [{ content: [], total: 0, nextLink: null }] },
            isLoading: false, hasNextPage: false, isFetchingNextPage: false, fetchNextPage: vi.fn(),
        });

        renderPage();

        expect(screen.getByRole('heading', { name: 'Action Protocols' })).toBeInTheDocument();
        expect(screen.getByText('No protocols yet.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'New protocol' })).toBeInTheDocument();
    });

    it('renders a protocol card with its usage count', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });
        mockUseActionProtocolsInfiniteQuery.mockReturnValue({
            data: {
                pages: [{
                    content: [{
                        id: 'p1', userId: 'u1', title: 'Deep breaths', trigger: 'Feeling overwhelmed',
                        script: 'Breathe in for 4, hold for 4, out for 4.', usageCount: 3, lastUsedAt: null,
                        createdAt: '', updatedAt: '',
                    }],
                    total: 1, nextLink: null,
                }],
            },
            isLoading: false, hasNextPage: false, isFetchingNextPage: false, fetchNextPage: vi.fn(),
        });

        renderPage();

        expect(screen.getByText('Deep breaths')).toBeInTheDocument();
        expect(screen.getByText('Used 3 times')).toBeInTheDocument();
    });
});
