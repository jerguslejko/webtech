import * as sqlite from 'sqlite';
import * as path from 'path';
import { hashPassword } from './auth';

const DATABASE_PATH = path.resolve(path.join(__dirname, '../database.sqlite'));

let CONNECTION: sqlite.Database | null = null;

export function connection(): sqlite.Database {
    if (!CONNECTION) {
        throw new Error('Not connected to the database.');
    }

    return CONNECTION;
}

export async function connect() {
    if (!CONNECTION) {
        CONNECTION = await sqlite.open(DATABASE_PATH);
    }

    return CONNECTION;
}

export async function disconnect() {
    if (!CONNECTION) {
        throw new Error("Can't disconnect from the database. Not connected.");
    }

    return CONNECTION.close();
}

export async function migrate() {
    const db = await connection();

    await db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username VARCHAR NOT NULL,
            password VARCHAR NOT NULL
        )`,
    );
}

export async function seed() {
    const db = await connection();

    await db.run(
        `INSERT INTO users (username, password) VALUES ('jergus', '${hashPassword('password')}')`,
    );
}
