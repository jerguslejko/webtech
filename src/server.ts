import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as https from 'https';
import * as fs from 'fs';
import * as passport from 'passport';
import * as path from 'path';
import * as database from './database';
import { authStrategy } from './auth';
import { User as UserModel } from './models';
import cookieSession = require('cookie-session');
import flash = require('connect-flash');
import homeRoutes from './routes/home';
import loginRoutes from './routes/login';
import usersRoutes from './routes/users';
import boardsRoutes from './routes/boards';
import tasksRoutes from './routes/tasks';
import columnsRoutes from './routes/columns';
import aboutRoutes from './routes/about';

declare global {
    namespace Express {
        interface Request {
            signedIn: UserModel;
        }
    }
}

const PORT = 5000;
const app = express();

passport.serializeUser((user: UserModel, done: any) => done(null, user.id));
passport.deserializeUser((id: number, done: any) =>
    UserModel.findByPk(id).then((user: UserModel | null) => done(null, user)),
);

passport.use(authStrategy());

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(cookieSession({ keys: ['cookie_key'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    req.signedIn = req.user as any;
    res.locals.signedIn = req.user;
    next();
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

homeRoutes(app);
loginRoutes(app);
usersRoutes(app);
boardsRoutes(app);
tasksRoutes(app);
columnsRoutes(app);
aboutRoutes(app);

async function main() {
    await database.connect();

    https
        .createServer(
            {
                key: fs.readFileSync(__dirname + '/../cert/server.key', 'utf8'),
                cert: fs.readFileSync(__dirname + '/../cert/server.cert', 'utf8'),
            },
            app,
        )
        .listen(PORT, () => {
            console.clear();
            console.log(`Server running on https://localhost:${PORT}`);
        });
}

main();
