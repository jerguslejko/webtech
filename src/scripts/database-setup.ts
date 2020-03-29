import { migrate, seed, connect, disconnect } from '../database';

async function main() {
    await connect();

    await migrate();
    await seed();

    await disconnect();
}

main();
