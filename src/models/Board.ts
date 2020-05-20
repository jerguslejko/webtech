import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import { Column } from './Column';
import { Task } from 'models';

export class Board extends Model {
    public id!: number;
    public title!: string;
    public user_id!: number;

    async columns(): Promise<Column[]> {
        return Column.findAll({ where: { board_id: this.id }, order: ['ordering'] });
    }

    async grid(): Promise<[Column, Task[]][]> {
        const grid: [Column, Task[]][] = [];
        for (const column of await this.columns()) {
            const tasks = await column.tasks();
            grid.push([column, tasks]);
        }
        return grid;
    }

    async addColumn(parameters: Record<string, any>): Promise<Column> {
        return await Column.create({
            ...parameters,
            user_id: this.user_id,
            board_id: this.id,
        });
    }

    static boot() {
        Board.init(
            {
                title: DataTypes.STRING,
                user_id: DataTypes.NUMBER,
            },
            {
                sequelize: connection(),
                modelName: 'board',
            },
        );
    }
}
