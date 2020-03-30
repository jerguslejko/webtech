import * as express from 'express';
import { restricted } from '../auth';

export default function(app: express.Express): void {
    app.get('/', restricted, async (req, res) => {
        res.render('home', {
            boards: await req.signedIn.boards(),
        });
    });
}
