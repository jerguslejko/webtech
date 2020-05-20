import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import { Column } from './Column';

export class Task extends Model {
    public id!: number;
    public body!: string;
    public user_id!: number;
    public board_id!: number;
    public column_id!: number;
    public ordering!: number;

    async column(): Promise<Column> {
        const column = await Column.findOne({ where: { id: this.column_id } });

        if (!column) {
            throw new Error('Column not found!');
        }

        return column;
    }

    static boot() {
        Task.init(
            {
                body: DataTypes.TEXT,
                user_id: DataTypes.NUMBER,
                board_id: DataTypes.NUMBER,
                column_id: DataTypes.NUMBER,
                ordering: DataTypes.NUMBER,
            },
            {
                sequelize: connection(),
                modelName: 'task',
                hooks: {
                    async beforeCreate(task) {
                        const column = await task.column();
                        const last_ordering = (await column.tasks())
                            .map((task) => task.ordering)
                            .reduce((xs, x) => Math.max(xs, x), 0);
                        task.ordering = last_ordering + 1;
                    },
                },
            },
        );
    }
}
