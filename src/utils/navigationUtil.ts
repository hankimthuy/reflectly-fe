/**
 * NavigationService - Bridge between Axios interceptor and React Router
 * 
 * Problem: Axios interceptor cannot access React Router hooks (useNavigate)
 * Solution: Callback pattern - App component registers navigation handler
 */

type NavigateFunction = (path: string, options?: { replace?: boolean; state?: unknown }) => void;

class NavigationUtil {
  private static navigateCallback: NavigateFunction | null = null;

  static setNavigate(navigateFn: NavigateFunction): void {
    this.navigateCallback = navigateFn;
  }

  /** Navigate to a path Used by axios interceptor to trigger navigation */
  static navigate(path: string, options?: { replace?: boolean; state?: unknown }): void {
    if (this.navigateCallback) {
      this.navigateCallback(path, options);
    } else {
      console.warn('NavigationService: navigate callback not registered, using fallback');
      window.location.href = path;
    }
  }

  /** Navigate to log in with current location preserved   */
  static navigateToLogin(currentPath?: string): void {
    const state = currentPath ? { from: currentPath } : undefined;
    this.navigate('/login', { replace: true, state });
  }
}

export default NavigationUtil;

