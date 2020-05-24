import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import { Column } from './Column';
import * as moment from 'moment';

export class Task extends Model {
    public id!: number;
    public name!: string;
    public body!: string;
    public deadline!: Date | null;
    public user_id!: number;
    public board_id!: number;
    public column_id!: number;
    public ordering!: number;

    get formattedDeadline() {
        if (!this.deadline) return;
        if (Number.isNaN(this.deadline.getTime())) return;

        return moment(this.deadline).format('YYYY-MM-DD');
    }

    get nicelyFormattedDeadline() {
        if (!this.deadline) return;
        if (Number.isNaN(this.deadline.getTime())) return;

        return moment(this.deadline).format('DD/MM/YYYY');
    }

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
                name: DataTypes.TEXT,
                body: DataTypes.TEXT,
                deadline: { type: DataTypes.DATE, allowNull: true },
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
