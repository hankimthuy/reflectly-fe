class CookieUtil {

    static setCookie(name: string, value: string, expiredDays: number) {
        // 1. Set Cookie (Best effort)
        const date = new Date();
        date.setTime(date.getTime() + (expiredDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        
        // Secure logic from previous step
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax" + secureFlag;

        // 2. Set LocalStorage (Backup for Safari/Mobile)
        // We only use this for critical auth tokens where cookies might fail on mobile
        try {
            localStorage.setItem(name, value);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }

    static getCookie(name: string): string {
        // 1. Try to get from Cookie
        const _name = name + "=";
        const cookies = document.cookie.split(';');
        for (const element of cookies) {
            let c = element;
            while (c.startsWith(' ')) {
                c = c.substring(1);
            }
            if (c.startsWith(_name)) {
                return c.substring(_name.length, c.length);
            }
        }

        // 2. Fallback: If cookie is missing, check LocalStorage
        // This rescues the session on Mobile Safari
        const localValue = localStorage.getItem(name);
        if (localValue) return localValue;

        return "";
    }

    static deleteCookie(name: string) {
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        // Clear both
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax' + secureFlag;
        localStorage.removeItem(name);
    }
}

export default CookieUtil;