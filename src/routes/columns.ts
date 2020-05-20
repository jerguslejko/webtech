import * as express from 'express';
import { restricted } from '../auth';
import { Column } from '../models/Column';

export default function (app: express.Express): void {
    app.post('/api/columns/reorder', restricted, async (req, res) => {
        const payload: { id: number; ordering: number }[] = req.body || [];

        for (const { id, ordering } of payload) {
            const column = await Column.findOne({ where: { id } });
            column?.update({ ordering });
        }

        res.json();
    });
}
