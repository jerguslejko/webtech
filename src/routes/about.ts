import * as express from 'express';
import { restricted } from '../auth';

export default function (app: express.Express): void {
    app.get('/about', restricted, async (req, res) => {
        res.render('about', {
            boards: await req.signedIn.boards(),
        });
    });
}
