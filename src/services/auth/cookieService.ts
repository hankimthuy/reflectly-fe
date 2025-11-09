import { jwtDecode } from 'jwt-decode';
import type { User } from '../../models/user';

interface GoogleJWTPayload {
  sub: string;           // Google user ID
  email: string;
  name: string;
  picture: string;
  exp: number;          // Expiration timestamp
  iat: number;          // Issued at timestamp
}

/**
 * CookieService - JWT token storage in cookies (stateless auth)
 */
class CookieService {
  private static readonly COOKIE_NAME = 'auth_token';
  private static readonly EXPIRATION_DAYS = 1;

  /** Set JWT token in cookie */
  static setToken(token: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000));
    
    const isProduction = window.location.protocol === 'https:';
    const secureFlag = isProduction ? 'Secure;' : '';
    
    document.cookie = `${this.COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; ${secureFlag}`;
  }

  /** Get JWT token from cookie */
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

  /** Remove token from cookie */
  static removeToken(): void {
    document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  /** Check if token exists and is valid */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<GoogleJWTPayload>(token);
      // Check if token is expired
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  /** Decode JWT and get user info from token */
  static getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<GoogleJWTPayload>(token);
      
      // Check if token is expired
      const now = Date.now() / 1000;
      if (decoded.exp <= now) {
        this.removeToken(); // Auto-remove expired token
        return null;
      }

      // Map Google JWT payload to User model
      return {
        id: decoded.sub,
        email: decoded.email,
        fullName: decoded.name,
        pictureUrl: decoded.picture
      };
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
}

export default CookieService;

