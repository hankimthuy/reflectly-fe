import { createContext, useContext, useEffect, type ReactNode } from 'react';

interface AppShellContextValue {
    setSidebarFooter: (node: ReactNode) => void;
}

export const AppShellContext = createContext<AppShellContextValue | null>(null);

/**
 * Lets a page swap out AppShell's default "this week" sidebar footer for something of its own
 * (Talk uses this for its recent-sessions + message-quota panel — see mockup 1b). Registers on
 * mount, clears on unmount, so navigating away always restores the default.
 */
export const useSidebarFooter = (node: ReactNode) => {
    const ctx = useContext(AppShellContext);
    useEffect(() => {
        if (!ctx) return undefined;
        ctx.setSidebarFooter(node);
        return () => ctx.setSidebarFooter(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, node]);
};
