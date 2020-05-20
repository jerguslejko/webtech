import * as express from 'express';
import { restricted } from '../auth';
import { Task } from '../models/Task';

export default function (app: express.Express): void {
    app.post('/api/tasks/reorder', restricted, async (req, res) => {
        const columns: { tasks: { id: number; ordering: number }[]; column_id: number }[] =
            req.body;

        for (const { column_id, tasks } of columns) {
            for (const { id, ordering } of tasks) {
                const task = await Task.findOne({ where: { id } });
                task?.update({ column_id, ordering });
            }
        }

        res.json();
    });
}
