import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import { Task } from './Task';

export class Column extends Model {
    public id!: number;
    public title!: string;
    public user_id!: number;
    public board_id!: number;

    async tasks(): Promise<Task[]> {
        return Task.findAll({ where: { board_id: this.board_id, column_id: this.id } });
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
            },
            {
                sequelize: connection(),
                modelName: 'column',
            },
        );
    }
}
