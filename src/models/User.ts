import { Model, DataTypes } from 'sequelize';
import { connection } from '../database';
import * as bcrypt from 'bcrypt';
import { Board } from './Board';

export class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;

    async boards(): Promise<Board[]> {
        return Board.findAll({ where: { user_id: this.id } });
    }

    validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    static boot() {
        User.init(
            {
                username: DataTypes.STRING,
                password: DataTypes.STRING,
            },
            {
                sequelize: connection(),
                modelName: 'user',
            },
        );
    }
}
