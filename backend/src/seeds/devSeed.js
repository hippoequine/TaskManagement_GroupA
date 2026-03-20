import sequelize from '../config/db.js';
import { applyAssociations, Issue, User, Board } from '../models/model.js';
import { faker } from '@faker-js/faker';

async function run() {
  try {
    await sequelize.authenticate();
    applyAssociations();

    await sequelize.sync({ alter: true });

    const [alice] = await User.findOrCreate({
      where: { email: 'alice@example.com' },
      defaults: {
        id: faker.string.uuid(),
        firstName: 'Alice',
        lastName: 'Dev',
        role: 'developer',
        email: 'alice@example.com',
        timezone: 'UTC',
        lastSyncedAt: new Date(),
      },
    });

    const [bob] = await User.findOrCreate({
      where: { email: 'bob@example.com' },
      defaults: {
        id: faker.string.uuid(),
        firstName: 'Bob',
        lastName: 'Tester',
        role: 'clinician',
        email: 'bob@example.com',
        timezone: 'UTC',
        lastSyncedAt: new Date(),
      },
    });

    const [board1] = await Board.findOrCreate({
      where: { title: 'Sprint Board' },
      defaults: {
        id: faker.string.uuid(),
        title: 'Sprint Board',
        projectId: null,
      },
    });

    const [board2] = await Board.findOrCreate({
      where: { title: 'Backlog Board' },
      defaults: {
        id: faker.string.uuid(),
        title: 'Backlog Board',
        projectId: null,
      },
    });

    const sampleTypes = ['bug', 'task', 'story'];
    for (let i = 0; i < 10; i++) {
      const title = `${faker.hacker.verb()} ${faker.hacker.noun()}`;
      const reporter = i % 2 === 0 ? alice : bob;

      const [issue] = await Issue.findOrCreate({
        where: { title },
        defaults: {
          id: faker.string.uuid(),
          title,
          description: faker.lorem.sentences(2),
          type: faker.helpers.arrayElement(sampleTypes),
          status: 'backlog',
          priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
          reporterId: reporter.id,
          storyPoints: faker.number.int({ min: 1, max: 8 }),
          dueDate: faker.date.soon(30),
        },
      });

      if (i % 3 === 0) {
        await issue.update({ boardId: board1.id || board1 });
      } else {
        await issue.update({ boardId: board2.id || board2 });
      }
    }

    console.log('Dev seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Dev seed error', err);
    process.exit(1);
  }
}

run();
