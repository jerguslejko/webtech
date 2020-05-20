import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import { Task } from './Task';
import { Board } from './Board';

export class Column extends Model {
    public id!: number;
    public title!: string;
    public user_id!: number;
    public board_id!: number;
    public ordering!: number;

    async board(): Promise<Board> {
        const board = await Board.findOne({ where: { id: this.board_id } });

        if (!board) {
            throw new Error('Board not found!');
        }

        return board;
    }

    async tasks(): Promise<Task[]> {
        return Task.findAll({
            where: { board_id: this.board_id, column_id: this.id },
            order: ['ordering'],
        });
    }

    async addTask(parameters: Record<string, any>): Promise<Task> {
        return await Task.create({
            ...parameters,
            user_id: this.user_id,
            board_id: this.board_id,
            column_id: this.id,
        });
    }

    static boot() {
        Column.init(
            {
                title: DataTypes.STRING,
                user_id: DataTypes.NUMBER,
                board_id: DataTypes.NUMBER,
                ordering: DataTypes.NUMBER,
            },
            {
                sequelize: connection(),
                modelName: 'column',
                hooks: {
                    async beforeCreate(column) {
                        const board = await column.board();
                        const last_ordering = (await board.columns())
                            .map((board) => board.ordering)
                            .reduce((xs, x) => Math.max(xs, x), 0);
                        column.ordering = last_ordering + 1;
                    },
                },
            },
        );
    }
}
