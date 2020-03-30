import * as express from 'express';
import * as passport from 'passport';
import { restricted, guest } from '../auth';

export default function(app: express.Express): void {
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
}
