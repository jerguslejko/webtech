import * as express from 'express';
import { restricted } from '../auth';

export default function(app: express.Express): void {
    app.get('/', restricted, (req, res) => {
        res.render('home');
    });
}
