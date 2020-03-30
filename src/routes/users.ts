import * as express from 'express';
import { restricted } from '../auth';
import { User } from '../models';

export default function(app: express.Express): void {
    app.get('/users/:id', restricted, async (req, res) => {
        const user = await User.findOne({ where: { id: parseInt(req.params.id) } });

        if (!user) {
            return res.redirect('/');
        }

        res.render('users/detail', { user });
    });
}
