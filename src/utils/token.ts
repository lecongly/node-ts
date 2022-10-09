import jwt from 'jsonwebtoken';
import User from '@/resources/user/user.interface';
import Token from '@/utils/interfaces/token.interface';

const { JWT_SECRET } = process.env;
export const createToken = (user: User): string => {
    return jwt.sign({ id: user._id }, JWT_SECRET as jwt.Secret, {
        expiresIn: '1d',
    });
};
export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET as jwt.Secret, (err, payload) => {
            if (err) return reject(err);
            resolve(payload as Token);
        });
    });
};

export default { createToken, verifyToken };
