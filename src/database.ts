import { Sequelize } from 'sequelize';
import * as path from 'path';
import * as models from './models';

const DATABASE_PATH = path.resolve(path.join(__dirname, '../database.sqlite'));

let CONNECTION: Sequelize | null = null;

export function connection(): Sequelize {
    if (!CONNECTION) {
        throw new Error('Not connected to the database.');
    }

    return CONNECTION;
}

export async function connect() {
    if (!CONNECTION) {
        CONNECTION = new Sequelize({
            dialect: 'sqlite',
            storage: DATABASE_PATH,
            logging: false,
        });

        Object.values(models).forEach(model => {
            model.boot();
        });
    }

    await CONNECTION.sync();
}

export async function disconnect() {
    if (!CONNECTION) {
        throw new Error("Can't disconnect from the database. Not connected.");
    }

    return CONNECTION.close();
}
