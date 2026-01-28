class CookieUtil {

    static setCookie(name: string, value: string, expiredDays: number) {
        const date = new Date();
        date.setTime(date.getTime() + (expiredDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        
        // dev: FIXED LOGIC
        // Only add Secure flag if the current protocol is HTTPS.
        // This allows cookies to work on mobile via LAN IP (http://192.168.x.x)
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax" + secureFlag;
    }

    static getCookie(name: string): string {
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
        return "";
    }

    static deleteCookie(name: string) {
        const isSecure = window.location.protocol === 'https:';
        const secureFlag = isSecure ? ';Secure' : '';
        
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Lax' + secureFlag;
    }
}

export default CookieUtil;