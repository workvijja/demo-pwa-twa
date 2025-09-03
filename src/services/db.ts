import Dexie, { type Table } from 'dexie';

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class DB extends Dexie {
  todos!: Table<Todo, number>;

  constructor() {
    super('DB');
    this.version(1).stores({
      todos: '++id, title, completed, createdAt, updatedAt'
    });
  }
}

export const db = new DB();

// Initialize some sample data
// export async function initDB() {
//   const count = await db.todos.count();
//   if (count === 0) {
//     await db.todos.bulkAdd([
//       {
//         title: 'Learn Next.js',
//         completed: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         title: 'Build a PWA',
//         completed: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ]);
//   }
// }

// Initialize the database when this module is loaded
// initDB().catch(console.error);
