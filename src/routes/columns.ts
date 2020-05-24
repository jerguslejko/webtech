import * as express from 'express';
import { restricted } from '../auth';
import { Column } from '../models/Column';

export default function (app: express.Express): void {
    app.post('/api/columns/create', restricted, async (req, res) => {
        const column = await Column.create(req.body);
        res.redirect(`/boards/${column.board_id}`);
    });

    app.post('/api/columns/:id/delete', restricted, async (req, res) => {
        const column = await Column.findByPk(req.params.id);
        if (!column) {
            return res.redirect(`/`);
        }
        await column.destroy();
        res.redirect(`/boards/${column.board_id}`);
    });

    app.post('/api/columns/:id/new-task', restricted, async (req, res) => {
        const column = await Column.findByPk(req.params.id);
        if (!column) return res.redirect(`/`);
        await column.addTask(req.body);
        res.redirect(`/boards/${column.board_id}`);
    });

    app.post('/api/columns/:id/update', restricted, async (req, res) => {
        const column = await Column.findByPk(req.params.id);
        if (!column) return res.redirect(`/`);
        await column.update(req.body);
        res.redirect(`/boards/${column.board_id}`);
    });

    app.post('/api/columns/reorder', restricted, async (req, res) => {
        const payload: { id: number; ordering: number }[] = req.body || [];

        for (const { id, ordering } of payload) {
            const column = await Column.findOne({ where: { id } });
            column?.update({ ordering });
        }

        res.json();
    });
}
