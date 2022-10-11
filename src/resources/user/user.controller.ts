import { authMiddleware } from '@/middleware/authenticated.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import UserService from '@/resources/user/user.service';
import validate from '@/resources/user/user.validation';
import { config } from '@/utils/config';
import HttpException from '@/utils/exceptions/http.exception';
import Controller from '@/utils/interfaces/controller.interface';
import { Cookies } from '@/utils/interfaces/token.interface';
import { clearTokens, setTokens } from '@/utils/token';
import { NextFunction, Request, Response, Router } from 'express';

class UserController implements Controller {
    public path = `/users`;
    public router = Router();
    private UserService = new UserService();
    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/activation`,
            validationMiddleware(validate.activation),
            this.activation
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.post(`${this.path}/refresh`, this.refresh);
        this.router.post(`${this.path}/logout`, authMiddleware, this.logout);
        this.router.post(
            `${this.path}/logout-all`,
            authMiddleware,
            this.logoutAll
        );
        this.router.post(
            `${this.path}/forgot`,
            validationMiddleware(validate.forgot),
            this.forgot
        );
        this.router.post(
            `${this.path}/reset`,
            authMiddleware,
            validationMiddleware(validate.resetPassword),
            this.resetPassword
        );
        this.router.get(`${this.path}/me`, authMiddleware, this.getUser);
        this.router.patch(
            `${this.path}/update`,
            authMiddleware,
            validationMiddleware(validate.update),
            this.update
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const data = await this.UserService.register(name, email, password);
            res.json({ data });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private activation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { activation_token } = req.body;
            const data = await this.UserService.activateEmail(activation_token);
            res.json({ data });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.UserService.login(
                email,
                password
            );
            setTokens(res, accessToken, refreshToken);
            res.redirect(`${config.clientUrl}/`);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private refresh = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const token = req.cookies[Cookies.RefreshToken];
            const { accessToken, refreshToken } =
                await this.UserService.refresh(token);
            setTokens(res, accessToken, refreshToken);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }

        res.end();
    };
    private logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        clearTokens(res);
        res.end();
    };
    private logoutAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.UserService.increaseTokenVersion(
                res.locals.token.userId
            );
            clearTokens(res);
            res.end();
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private forgot = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email } = req.body;
            const data = await this.UserService.forgot(email);
            res.json({ data });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.UserService.getUserById(
                res.locals.token.userId
            );
            res.json({ data: user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { password } = req.body;
            const data = await this.UserService.resetPassword(
                res.locals.token.userId,
                password
            );
            res.json({ data });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, avatar } = req.body;
            const data = await this.UserService.updateUser(
                res.locals.token.userId,
                name,
                avatar
            );
            res.json({ data });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;
