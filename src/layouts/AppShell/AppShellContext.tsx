import { createContext, useContext, useEffect, useRef, type DependencyList, type ReactNode } from 'react';

interface AppShellContextValue {
    setSidebarFooter: (node: ReactNode) => void;
}

export const AppShellContext = createContext<AppShellContextValue | null>(null);

/**
 * Lets a page swap out AppShell's default "this week" sidebar footer for something of its own
 * (Talk uses this for its recent-sessions + message-quota panel — see mockup 1b). Registers on
 * mount, clears on unmount, so navigating away always restores the default.
 *
 * Takes a *builder* plus its own dependency list rather than the node itself: JSX passed
 * directly is a brand-new object on every render, so keying the effect off it re-registered the
 * footer forever (setState → AppShell re-render → new node → setState…) and blew the render
 * depth, taking the whole page down with it. Deps say when the footer's content actually
 * changed; everything else leaves it alone.
 */
export const useSidebarFooter = (build: () => ReactNode, deps: DependencyList) => {
    const ctx = useContext(AppShellContext);
    const buildRef = useRef(build);
    buildRef.current = build;

    useEffect(() => {
        if (!ctx) return undefined;
        ctx.setSidebarFooter(buildRef.current());
        return () => ctx.setSidebarFooter(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, ...deps]);
};
