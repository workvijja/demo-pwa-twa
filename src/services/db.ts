import Dexie, { type Table } from 'dexie';
import { Todo } from "@/schemas/todo";

type SyncStatus = 'synced' | 'pending' | 'error';

export type LocalTodo = Omit<Todo, 'id'> & {
  local_id?: number;
  server_id?: number;
  sync_status: SyncStatus;
  last_sync_at?: Date;
  last_error?: string;
}

class DB extends Dexie {
  todos!: Table<LocalTodo, number>;

  constructor() {
    super('DB');
    this.version(1).stores({
      todos: '++local_id, &server_id, title, completed, created_at, updated_at, deleted_at, sync_status, last_sync_at',
    });
    
    // In case of version upgrade, migrate data
    // this.version(1).stores({
    //   todos: '++id, title, completed, created_at, updated_at, deleted_at',
    // }).upgrade(tx => {
    //   return tx.table('todos').toCollection().modify(todo => {
    //     // Add default sync status for existing todos
    //     todo.syncStatus = 'synced';
    //     todo.lastSyncAt = new Date();
    //     if (todo.id > 0) {
    //       todo.serverId = todo.id;
    //     }
    //   });
    // });
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
