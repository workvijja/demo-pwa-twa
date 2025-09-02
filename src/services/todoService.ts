import { db, type Todo } from './db';

export const getTodos = async (): Promise<Todo[]> => {
  return db.todos.orderBy('updatedAt').reverse().toArray();
};

export const getTodo = async (id: number): Promise<Todo | undefined> => {
  return db.todos.get(id);
};

export const addTodo = async (data: Pick<Todo, 'title'>): Promise<number> => {
  const now = new Date();
  return db.todos.add({
    ...data,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateTodo = async (data: {id: number} & Omit<Partial<Todo>, 'id'>): Promise<number> => {
  const {id, ...updates} = data
  return db.todos.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteTodo = async (id: number): Promise<void> => {
  return db.todos.delete(id);
};
