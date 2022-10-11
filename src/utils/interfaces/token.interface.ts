export enum Cookies {
    AccessToken = 'access',
    RefreshToken = 'refresh',
}

export interface ActivationTokenPayload {
    name: string;
    email: string;
    password: string;
}
export interface ActivationToken extends ActivationTokenPayload {
    exp: number;
}
export interface AccessTokenPayload {
    userId: string;
}

export interface AccessToken extends AccessTokenPayload {
    exp: number;
}

export interface RefreshTokenPayload {
    userId: string;
    version: number;
}

export interface RefreshToken extends RefreshTokenPayload {
    exp: number;
}
