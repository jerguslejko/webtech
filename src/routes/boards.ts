import * as express from 'express';
import { restricted } from '../auth';
import { Board, Column, Task } from '../models';

export default function(app: express.Express): void {
    app.get('/boards/:id', restricted, async (req, res) => {
        const board = await Board.findOne({ where: { id: parseInt(req.params.id) } });

        if (!board) {
            return res.redirect('/');
        }

        res.render('boards/detail', { board, grid: await board.grid() });
    });
}
