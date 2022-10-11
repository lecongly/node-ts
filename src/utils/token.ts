import User from '@/resources/user/user.interface';
import {
    AccessToken,
    AccessTokenPayload,
    ActivationToken,
    ActivationTokenPayload,
    Cookies,
    RefreshToken,
    RefreshTokenPayload,
} from '@/utils/interfaces/token.interface';
import { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config';

enum TokenExpiration {
    Activation = 5 * 60,
    Access = 5 * 60,
    Refresh = 7 * 24 * 60 * 60,
    RefreshIfLessThan = 4 * 24 * 60 * 60,
}
export function signActivationToken(payload: ActivationTokenPayload): string {
    return jwt.sign(payload, config.activationTokenSecret as jwt.Secret, {
        expiresIn: TokenExpiration.Activation,
    });
}
function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, config.accessTokenSecret as jwt.Secret, {
        expiresIn: TokenExpiration.Access,
    });
}

function signRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, config.refreshTokenSecret as jwt.Secret, {
        expiresIn: TokenExpiration.Refresh,
    });
}

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
    domain: config.baseDomain,
    path: '/',
};

const refreshTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
};

const accessTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
};

export function verifyActivationToken(token: string) {
    return jwt.verify(token, config.activationTokenSecret) as ActivationToken;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, config.refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, config.accessTokenSecret) as AccessToken;
}

export function buildTokens(user: User) {
    const accessPayload: AccessTokenPayload = { userId: user._id };
    const refreshPayload: RefreshTokenPayload = {
        userId: user._id,
        version: user.tokenVersion,
    };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
}

export function setTokens(res: Response, access: string, refresh?: string) {
    res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
    if (refresh)
        res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
    if (tokenVersion !== current.version) throw 'Token revoked';

    const accessPayload: AccessTokenPayload = { userId: current.userId };
    let refreshPayload: RefreshTokenPayload | undefined;

    const expiration = new Date(current.exp * 1000);
    const now = new Date();
    const secondsUntilExpiration =
        (expiration.getTime() - now.getTime()) / 1000;

    if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
        refreshPayload = { userId: current.userId, version: tokenVersion };
    }

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
}

export function clearTokens(res: Response) {
    res.cookie(Cookies.AccessToken, '', { ...defaultCookieOptions, maxAge: 0 });
    res.cookie(Cookies.RefreshToken, '', {
        ...defaultCookieOptions,
        maxAge: 0,
    });
}
