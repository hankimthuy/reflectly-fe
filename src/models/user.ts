export interface User {
    id: string;
    email: string;
    pictureUrl: string;
    fullName: string;
    tokenExpiresAt?: number; // Unix timestamp (seconds) from backend
}
