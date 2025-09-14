import { db } from "./db";
import type { LocalTodo } from "./db";
import { CreateTodo, GetTodo, Todo, UpdateTodo } from "@/schemas/todo";
import api, { APIResponse } from "@/lib/axios";
import {AxiosError} from "axios";
// import { v4 as uuidv4 } from "uuid";

const isOnline = () => typeof navigator !== "undefined" && navigator.onLine;
// const generateTempId = () => `temp_${uuidv4()}`;
const now = () => new Date();

/* ----------------------------- Core Sync Logic ---------------------------- */

const handleDelete = async (item: LocalTodo) => {
  if (item.server_id) {
    await api.delete(`/api/v1/public/todos/${item.server_id}`);
  }
  await db.todos.delete(item.local_id!);
};

const handleCreate = async (item: LocalTodo) => {
  const todo: CreateTodo = {
    title: item.title
  }
  const { data: {data: serverId} } = await api.post<APIResponse<number>>("/api/v1/public/todos", todo);

  await db.todos.update(item.local_id!, {
    sync_status: "synced",
    last_sync_at: now(),
    server_id: serverId,
  });
};

const handleUpdate = async (item: LocalTodo) => {
  const todo: UpdateTodo = {
    title: item.title,
    completed: item.completed
  }
  await api.put(`/api/v1/public/todos/${item.server_id}`, todo);

  await db.todos.update(item.local_id!, {
    sync_status: "synced",
    last_sync_at: now(),
    last_error: undefined,
  });
};

const syncWithServer = async () => {
  if (!isOnline()) return;

  const pending = await db.todos
    .where("sync_status")
    .anyOf(["pending", "error"])
    .toArray();

  for (const item of pending) {
    try {
      if (item.deleted_at) {
        await handleDelete(item);
      } else if (item.server_id) {
        await handleUpdate(item);
      } else if (!item.server_id) {
        await handleCreate(item);
      }
    } catch (err) {
      const errorMsg = err instanceof AxiosError
        ? err.response?.data.error || err.message
        : err instanceof Error
          ? err.message
          : "Unknown error";
      console.error("Sync error:", errorMsg);

      await db.todos.update(item.local_id!, {
        sync_status: "error",
        last_error: errorMsg,
      });
    }
  }
};

/* ----------------------------- Public API ---------------------------- */

// Re-sync when online again
if (typeof window !== "undefined") {
  window.addEventListener("online", syncWithServer);
}

export const getTodos = async (): Promise<LocalTodo[]> => {
  if (isOnline()) {
    try {
      const n = now().toISOString()
      const { data: {data: serverTodos} } = await api.get<APIResponse<GetTodo[]>>("/api/v1/public/todos");

      const serverTodoIds = serverTodos.map(({id}) => id);
      const localTodos = await db.todos.where('server_id').anyOf(serverTodoIds).toArray();

      const mergedTodos: LocalTodo[] = serverTodos.map(serverTodo => {
        const localTodo = localTodos.find(todo => todo.server_id === serverTodo.id);
        const {id: server_id, ...restServerTodo} = serverTodo
        if (localTodo) {
          return {
            ...localTodo,
            ...restServerTodo,
            sync_status: "synced",
            last_sync_at: now(),
            last_error: undefined,
          }
        }

        return {
          server_id,
          ...restServerTodo,
          sync_status: "synced",
          last_sync_at: now(),
          last_error: undefined,
        }
      })

      await db.todos.bulkPut(mergedTodos)

      localStorage.setItem("lastSync", n);
    } catch (err) {
      console.error("Failed to sync todos:", err);
    }
  }

  return db.todos.orderBy('updated_at').reverse().toArray().then(todos => todos.filter(todo => !todo.deleted_at));
};
//
// export const getTodo = async (id: number | string) => {
//   const isTemp = typeof id === "string" && id.startsWith("temp_");
//
//   if (isTemp) return db.todos.get(id);
//
//   if (isOnline()) {
//     try {
//       const { data } = await api.get<APIResponse<GetTodo>>(`/api/v1/public/todos/${id}`);
//       if (data.data) {
//         await db.todos.put({
//           ...data.data,
//           syncStatus: "synced" as SyncStatus,
//           serverId: data.data.id,
//           lastSyncAt: now(),
//         });
//         return data.data;
//       }
//     } catch (err) {
//       console.error(`Failed to fetch todo ${id}:`, err);
//     }
//   }
//
//   return db.todos.get(Number(id));
// };
//
export const addTodo = async (todoData: CreateTodo): Promise<LocalTodo> => {
  const n = now()
  const newTodo: LocalTodo = {
    ...todoData,
    completed: false,
    created_at: n,
    updated_at: n,
    deleted_at: null,
    sync_status: "pending",
  };

  const local_id = await db.todos.add(newTodo);

  if (isOnline()) await syncWithServer();

  return { ...newTodo, local_id };
};

export const updateTodo = async (data: UpdateTodo & {local_id: number}): Promise<void> => {
  const {local_id, ...updates} = data;
  const todo = db.todos.get(local_id);

  if (!todo) throw new Error("Todo not found");

  await db.todos.update(local_id, {
    ...updates,
    updated_at: now(),
    sync_status: "pending",
  });

  if (isOnline()) await syncWithServer();
};

export const deleteTodo = async (local_id: number): Promise<void> => {
  const todo = await db.todos.get(local_id)

  if (!todo) return;

  if (!todo.server_id) {
    await db.todos.delete(local_id); // Local-only, just remove
  } else {
    await db.todos.update(local_id, {
      deleted_at: now(),
      sync_status: "pending",
    });
  }

  if (isOnline()) await syncWithServer();
};
//
// export const syncTodos = async (): Promise<void> => {
//   if (isOnline()) await syncWithServer();
// };
