import * as express from 'express';
import { restricted } from '../auth';
import { Board } from '../models';

export default function (app: express.Express): void {
    app.post('/api/boards/create', restricted, async (req, res) => {
        const board = await Board.create({ ...req.body, user_id: req.signedIn.id });
        res.redirect(`/boards/${board.id}`);
    });

    app.post('/api/boards/:id/update', restricted, async (req, res) => {
        const board = await Board.findByPk(req.params.id);
        if (!board) {
            return res.redirect(`/`);
        }
        await board.update(req.body);
        res.redirect(`/boards/${board.id}`);
    });

    app.post('/api/boards/:id/delete', restricted, async (req, res) => {
        const board = await Board.findByPk(req.params.id);
        if (!board) {
            return res.redirect(`/`);
        }
        await board.destroy();
        res.redirect(`/`);
    });

    app.get('/boards/:id', restricted, async (req, res) => {
        const board = await Board.findOne({ where: { id: parseInt(req.params.id) } });

        if (!board) {
            return res.redirect('/');
        }

        if (board.user_id != req.signedIn.id) {
            return res.redirect('/');
        }

        res.render('boards/detail', {
            board,
            grid: await board.grid(),
            boards: await req.signedIn.boards(),
        });
    });
}
