import * as express from 'express';
import * as passport from 'passport';
import { restricted, guest } from '../auth';
import { User } from '../models/User';

export default function (app: express.Express): void {
    app.get('/login', guest, (req, res) => {
        res.render('login', { error: req.flash('error')[0] });
    });

    app.get('/logout', restricted, (req, res) => {
        req.logout();
        res.redirect('/login');
    });

    app.post(
        '/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        }),
    );

    app.get('/register', guest, (req, res) => {
        res.render('register', { error: req.flash('error')[0] });
    });

    app.post('/register', async (req, res) => {
        const { username, password, password_confirmation } = req.body;

        if (!username) {
            req.flash('error', 'Missing username');
            res.redirect('/register');
            return;
        }

        if (!password) {
            req.flash('error', 'Missing password');
            res.redirect('/register');
            return;
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be 6 or more characters long');
            res.redirect('/register');
            return;
        }

        if (password != password_confirmation) {
            req.flash('error', "Passwords don't match");
            res.redirect('/register');
            return;
        }

        if (await usernameTaken(username)) {
            req.flash('error', 'Username already taken');
            res.redirect('/register');
            return;
        }

        const user = await User.create(req.body);

        req.login(user, () => {
            res.redirect('/');
        });
    });
}

async function usernameTaken(username: string): Promise<boolean> {
    const result = await User.findOne({ where: { username } });

    return result != null;
}
