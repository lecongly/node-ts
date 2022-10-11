import HttpException from '@/utils/exceptions/http.exception';
import { Cookies } from '@/utils/interfaces/token.interface';
import { verifyAccessToken } from '@/utils/token';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);

    if (!token) {
        return next(new HttpException(401, 'Unauthorized'));
    }

    res.locals.token = token;

    next();
}
