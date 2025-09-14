import {z} from "zod";

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  deleted_at: z.coerce.date().nullable(),
})
export type Todo = z.infer<typeof todoSchema>

export const getTodoSchema = todoSchema.clone()
export type GetTodo = z.infer<typeof getTodoSchema>

export const createTodoSchema = todoSchema.pick({title: true})
export type CreateTodo = z.infer<typeof createTodoSchema>

export const updateTodoSchema = todoSchema.pick({title: true}).extend({
  completed: z.boolean().optional()
})
export type UpdateTodo = z.infer<typeof updateTodoSchema>

export const deleteTodoSchema = todoSchema.pick({id: true})
export type DeleteTodo = z.infer<typeof deleteTodoSchema>

