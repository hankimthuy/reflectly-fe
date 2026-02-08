/**
 * Device detection utility for mobile-specific handling
 */

class DeviceUtil {
    private static _isMobile: boolean | null = null;
    private static _isTablet: boolean | null = null;
    private static _isIOS: boolean | null = null;

    static get isMobile(): boolean {
        if (this._isMobile === null) {
            this._isMobile = this.detectMobile();
        }
        return this._isMobile;
    }

    static get isTablet(): boolean {
        if (this._isTablet === null) {
            this._isTablet = this.detectTablet();
        }
        return this._isTablet;
    }

    static get isIOS(): boolean {
        if (this._isIOS === null) {
            this._isIOS = this.detectIOS();
        }
        return this._isIOS;
    }

    static get isMobileOrTablet(): boolean {
        return this.isMobile || this.isTablet;
    }

    private static detectMobile(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'blackberry', 'mobile', 'opera mini',
            'windows phone', 'palm', 'webos', 'iemobile'
        ];
        
        return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
               (typeof window.orientation !== 'undefined') ||
               (navigator.maxTouchPoints > 0 && navigator.maxTouchPoints <= 2);
    }

    private static detectTablet(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        const tabletKeywords = [
            'ipad', 'tablet', 'kindle', 'silk', 'playbook'
        ];
        
        // Check for iPad specifically (newer iPads may not have 'iPad' in UA)
        const isIPad = userAgent.includes('ipad') || 
                      (userAgent.includes('mac') && 'ontouchend' in document);
        
        return isIPad || tabletKeywords.some(keyword => userAgent.includes(keyword)) ||
               (navigator.maxTouchPoints > 2 && !this.detectMobile());
    }

    private static detectIOS(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    static getDeviceInfo(): string {
        const info = [];
        if (this.isMobile) info.push('Mobile');
        if (this.isTablet) info.push('Tablet');
        if (this.isIOS) info.push('iOS');
        if (this.isMobileOrTablet) info.push('Touch Device');
        
        return info.length > 0 ? info.join(', ') : 'Desktop';
    }

    static logDeviceInfo(): void {
        console.log('DeviceUtil: Device info:', {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints,
            deviceInfo: this.getDeviceInfo(),
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isIOS: this.isIOS,
            isMobileOrTablet: this.isMobileOrTablet
        });
    }
}

export default DeviceUtil;
