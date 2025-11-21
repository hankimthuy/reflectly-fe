class CookieService {
  private static readonly COOKIE_NAME = 'auth_token';
  private static readonly EXPIRATION_DAYS = 1;

  static setToken(token: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000));

    const isProduction = window.location.protocol === 'https:';
    const secureFlag = isProduction ? 'Secure;' : '';

    document.cookie = `${this.COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; ${secureFlag}`;
  }

  static getToken(): string | null {
    const name = `${this.COOKIE_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  static removeToken(): void {
    document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export default CookieService;

