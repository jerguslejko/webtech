import { connect, disconnect } from '../database';
import * as bcrypt from 'bcrypt';
import { User, Board, Column, Task } from '../models';
import * as faker from 'faker';

async function main() {
    await connect();

    await User.sync();
    await Board.sync();
    await Column.sync();
    await Task.sync();

    const user = await User.create({
        username: 'user',
        password: bcrypt.hashSync('password', 10),
    });

    const personal = await Board.create({ title: 'Personal', user_id: user.id });
    const personal_todo = await personal.addColumn({ title: 'TODO' });
    times(5, () =>
        personal_todo.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const personal_in_progress = await personal.addColumn({ title: 'In Progress' });
    times(3, () =>
        personal_in_progress.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const personal_done = await personal.addColumn({ title: 'Done' });
    times(2, () =>
        personal_done.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );

    const work = await Board.create({ title: 'Work', user_id: user.id });
    const work_backlog = await work.addColumn({ title: 'Backlog' });
    times(5, () =>
        work_backlog.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const work_todo = await work.addColumn({ title: 'TODO' });
    times(8, () =>
        work_todo.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const work_in_progress = await work.addColumn({ title: 'In Progress' });
    times(2, () =>
        work_in_progress.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const work_done = await work.addColumn({ title: 'Done' });
    times(4, () =>
        work_done.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );

    const ideas = await Board.create({ title: 'Ideas', user_id: user.id });
    const ideas_coding = await ideas.addColumn({ title: 'Coding' });
    times(1, () =>
        ideas_coding.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const ideas_cooking = await ideas.addColumn({ title: 'Cooking' });
    times(12, () =>
        ideas_cooking.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const ideas_baking = await ideas.addColumn({ title: 'Baking' });
    times(0, () =>
        ideas_baking.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );

    await disconnect();
}

function times(n: number, cb: () => void) {
    for (let i = 0; i < n; i++) {
        cb();
    }
}

main();
