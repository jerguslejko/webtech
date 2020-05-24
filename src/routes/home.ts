import * as express from 'express';
import { restricted } from '../auth';
import { Task } from '../models/Task';
import { Op } from 'sequelize';

export default function (app: express.Express): void {
    app.get('/', restricted, async (req, res) => {
        const upcoming = await Task.findAll({
            where: { user_id: req.signedIn.id, deadline: { [Op.ne]: null, [Op.gt]: new Date() } },
            order: ['deadline'],
            limit: 10,
        });

        const missed = await Task.findAll({
            where: { user_id: req.signedIn.id, deadline: { [Op.ne]: null, [Op.lt]: new Date() } },
            order: ['deadline'],
            limit: 10,
        });

        res.render('home', {
            upcoming,
            missed,
            boards: await req.signedIn.boards(),
        });
    });
}
