import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';

export class Task extends Model {
    public id!: number;
    public body!: string;
    public user_id!: number;
    public board_id!: number;
    public column_id!: number;

    static boot() {
        Task.init(
            {
                body: DataTypes.TEXT,
                user_id: DataTypes.NUMBER,
                board_id: DataTypes.NUMBER,
                column_id: DataTypes.NUMBER,
            },
            {
                sequelize: connection(),
                modelName: 'task',
            },
        );
    }
}
