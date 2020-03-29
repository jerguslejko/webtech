import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as path from 'path';
import * as database from './database';
import { authStrategy, restricted, guest } from './auth';
import cookieSession = require('cookie-session');
import flash = require('connect-flash');

const PORT = 5000;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(cookieSession({ keys: ['cookie_key'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(authStrategy());

app.use((req, res, next) => {
    res.locals.signedIn = req.user;

    next();
});

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

app.get('/', restricted, (req, res) => {
    res.render('home');
});

app.get('/users/:id', restricted, async (req, res) => {
    const db = await database.connection();

    const query = await db.prepare('select * from users where id = ?', [parseInt(req.params.id)]);
    const user = await query.get();

    if (!user) {
        return res.redirect('/');
    }

    res.render('users/detail', { user });
});

async function main() {
    await database.connect();

    app.listen(PORT, () => {
        console.clear();
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

main();
