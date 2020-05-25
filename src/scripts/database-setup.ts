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
    const work = await Board.create({ title: 'Work', user_id: user.id });
    const work_backlog = await work.addColumn({ title: 'Backlog', color:'#eb4034' });
    times(5, () =>
        work_backlog.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const work_todo = await work.addColumn({ title: 'TODO', color:'#21963b'});
    times(8, () =>
        work_todo.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const work_in_progress = await work.addColumn({ title: 'In Progress', color:'#464a8c' });
    times(2, () =>
        work_in_progress.addTask({ name: faker.random.words(5), body: faker.random.words(10), deadline: Date() }),
    );
    const work_done = await work.addColumn({ title: 'Done', color:'#1c9490' });
    times(4, () =>
        work_done.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );

    const ideas = await Board.create({ title: 'Ideas', user_id: user.id });
    const ideas_cooking = await ideas.addColumn({ title: 'Cooking' , color:'#a3290d'});
    times(12, () =>
        ideas_cooking.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    const ideas_baking = await ideas.addColumn({ title: 'Baking' , color:'#d182c9' });
    times(0, () =>
        ideas_baking.addTask({ name: faker.random.words(5), body: faker.random.words(10) }),
    );
    // const personal = await Board.create({ title: 'Personal', user_id: user.id });
    // const personal_todo = await personal.addColumn({ title: 'To do', color:'#eb4034'});
    // personal_todo.addTask({ name: 'Call mum'});
    // personal_todo.addTask({ name: 'Clean kitchen'});
    // personal_todo.addTask({ name: 'Pay water bill', deadline : new Date()});
    // const personal_food = await personal.addColumn({ title: 'Shopping', color:'#464a8c' });
    // personal_food.addTask({ name: 'Milk'});
    // personal_food.addTask({ name: 'Eggs'});
    // const personal_uni = await personal.addColumn({ title: 'Uni', color:'#21963b' });
    // personal_uni.addTask({ name: 'Submit Web Tech coursework', deadline : new Date()});

    // const work = await Board.create({ title: 'Work', user_id: user.id });
    // const work_backlog = await work.addColumn({ title: 'To Do', color:'#d182c9'});
    // work_backlog.addTask({ name: 'PostgresSQL database', body : 'hook up PSQL DB', deadline : new Date()});
    // work_backlog.addTask({ name: 'home page logo', body : 'add large logo to front page', deadline : new Date()});
    // work_backlog.addTask({ name: 'NavBar', body : 'add responsive nav bar to all pages', deadline : new Date()});

    // const work_doing = await work.addColumn({ title: 'Doing', color:'#2b910c'});
    // work_doing.addTask({ name: 'HTTPS', body : 'get SSL certificate', deadline : new Date()});

    // const work_blocked = await work.addColumn({ title: 'Blocked', color:'#a3290d'});
    // work_blocked.addTask({ name: 'Database Schema', body : 'design SQL schema for DB', deadline : new Date()});

    // const work_integrating = await work.addColumn({ title: 'Integrating', color:'#1c9490'});
    // work_integrating.addTask({ name: 'Authentication', body : 'ability to login into account', deadline : new Date()});
    // work_integrating.addTask({ name: 'Home Page', deadline : new Date()});


    await disconnect();
}

function times(n: number, cb: () => void) {
    for (let i = 0; i < n; i++) {
        cb();
    }
}

main();
