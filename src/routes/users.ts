import * as express from 'express';
import * as database from '../database';
import { restricted } from '../auth';

export default function(app: express.Express): void {
    app.get('/users/:id', restricted, async (req, res) => {
        const db = await database.connection();

        const query = await db.prepare('select * from users where id = ?', [
            parseInt(req.params.id),
        ]);
        const user = await query.get();

        if (!user) {
            return res.redirect('/');
        }

        res.render('users/detail', { user });
    });
}
