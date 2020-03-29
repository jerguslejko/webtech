import * as passportLocal from 'passport-local';
import * as bcrypt from 'bcrypt';
import * as database from './database';
import { Request, Response, NextFunction } from 'express';

interface User {
    id: number;
    username: string;
    password: string;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const query = await database
        .connection()
        .prepare('select * from users where username = ?', [username]);

    return await query.get();
}

export function validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
}

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function authStrategy() {
    return new passportLocal.Strategy(async (username, password, done) => {
        const user = await getUserByUsername(username);

        if (!user) {
            done(null, false, { message: 'Incorrect username.' });
            return;
        }

        if (!validatePassword(user, password)) {
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
