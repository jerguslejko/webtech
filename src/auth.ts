import * as passportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import { User } from './models';

export function authStrategy() {
    return new passportLocal.Strategy(async (username, password, done) => {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            done(null, false, { message: 'Incorrect username.' });
            return;
        }

        if (!user.validatePassword(password)) {
            done(null, false, { message: 'Incorrect password.' });
            return;
        }

        done(null, user);
    });
}

export function restricted(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    next();
}

export function guest(req: Request, res: Response, next: NextFunction): void {
    if (req.user) {
        res.redirect('/');
        return;
    }

    next();
}
