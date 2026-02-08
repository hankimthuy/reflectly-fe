class CookieUtil {

    static setCookie(name: string, value: string, expiredDays: number) {
        console.log(`CookieUtil: Setting cookie ${name}`);
        const date = new Date();
        date.setTime(date.getTime() + (expiredDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax" + secureFlag;
        console.log(`CookieUtil: Cookie set: ${document.cookie.includes(name + '=')}`);

        try {
            localStorage.setItem(name, value);
            console.log(`CookieUtil: LocalStorage set for ${name}`);
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    }

    static getCookie(name: string): string {
        const _name = name + "=";
        const cookies = document.cookie.split(';');
        let cookieValue = "";
        
        for (const element of cookies) {
            let c = element;
            while (c.startsWith(' ')) {
                c = c.substring(1);
            }
            if (c.startsWith(_name)) {
                cookieValue = c.substring(_name.length, c.length);
                console.log(`CookieUtil: Found ${name} in cookie`);
                return cookieValue;
            }
        }

        const localValue = localStorage.getItem(name);
        if (localValue) {
            console.log(`CookieUtil: Found ${name} in localStorage fallback`);
            return localValue;
        }

        console.log(`CookieUtil: ${name} not found in cookie or localStorage`);
        return "";
    }

    static deleteCookie(name: string) {
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax' + secureFlag;
        localStorage.removeItem(name);
    }
}

export default CookieUtil;