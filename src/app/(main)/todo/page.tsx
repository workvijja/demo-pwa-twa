'use client';

import { useState } from 'react';
import {useMutation, UseMutationResult, useQuery, useQueryClient} from '@tanstack/react-query';
import {Check, Cloud, CloudCheck, Loader2, Pencil, Plus, Trash2, X} from 'lucide-react';
import {addTodo, deleteTodo, getTodos, syncTodos, updateTodo} from "@/services/todoService";
import {CreateTodo, createTodoSchema, GetTodo} from "@/schemas/todo";
import {APIError, APIResponse} from "@/lib/axios";
import {LocalTodo} from "@/services/db";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form} from "@/components/ui/form";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";

const AddTodoForm = ({addMutation}: {addMutation: UseMutationResult<LocalTodo, Error, CreateTodo>}) => {
  const form = useForm<CreateTodo>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: ""
    }
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await addMutation.mutateAsync(data)
      toast.success("Todo added successfully")
      form.reset()
    } catch(e) {
      const err = e as Error
      toast.error("Failed to add todo", {
        description: err.message
      })
    }
  })

  const title = form.watch("title")

  return (
    <Form {...form}>
      <form className="relative" onSubmit={handleSubmit}>
        <input
          {...form.register("title")}
          className="pl-4 pr-17 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add a new todo..."
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 text-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
          disabled={addMutation.isPending || !title.trim()}
        >
          {addMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin"/>
          ) : (
            <Plus className="h-4 w-4"/>
          )}
        </button>
      </form>
    </Form>
  )
}

export default function TodoPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const queryClient = useQueryClient();

  // Fetch todos
  const {data: todos = [], isLoading} = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const syncMutation = useMutation({
    mutationFn: syncTodos,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
    }
  });

  // Add to do mutation
  const addMutation = useMutation<LocalTodo, Error, CreateTodo>({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
      syncMutation.mutate();
    },
  });

  // Toggle to do mutation
  const toggleMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
      syncMutation.mutate();
    },
  });

  // Delete to do mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      syncMutation.mutate();
    },
  });

  // Update to do mutation
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingId(null);
      syncMutation.mutate();
    },
  });

  // const handleAddTodo = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newTodo.trim()) return;
  //
  //   addMutation.mutate({
  //     title: newTodo.trim()
  //   });
  // };

  const handleToggle = (id: number, title: string, completed: boolean) => {
    toggleMutation.mutate({ local_id: id, title, completed: !completed });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Todo deleted successfully");
      }
    });
  };

  const handleStartEditing = (todo: LocalTodo) => {
    setEditingId(todo.local_id!);
    setEditText(todo.title);
  };

  const handleSaveEdit = (id: number) => {
    if (editText.trim()) {
      updateMutation.mutate({ local_id: id, title: editText.trim() }, {
        onSuccess: () => {
          toast.success("Todo updated successfully");
        }
      });
    } else {
      setEditingId(null);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Todo App</h1>

        {/* Add To do Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <AddTodoForm addMutation={addMutation}/>
          <div className={"mt-2"}>
            <Button size={"sm"} variant={"link"} className={"text-muted-foreground"} disabled={syncMutation.isPending}  onClick={() => syncMutation.mutate()}>
              {
                syncMutation.isPending ? <>
                  <Loader2 />
                  Syncing...
                </> : <>
                  <CloudCheck />
                  Last sync {format(localStorage?.getItem("lastSync") || "", "yyyy-MM-dd HH:mm:ss")}
                </>
              }
            </Button>
          </div>
        </div>

        {/* To do List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Filter Tabs */}
          <div className="flex border-b">
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${
                  filter === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter(tab as 'all' | 'active' | 'completed')}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Todo Items */}
          {filteredTodos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all'
                ? 'No todos yet. Add one above!'
                : filter === 'active'
                ? 'No active todos.'
                : 'No completed todos.'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTodos.map((todo) => (
                <li key={todo.local_id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.local_id!, todo.title, todo.completed)}
                      disabled={toggleMutation.isPending}
                      className="h-5 w-5 shrink-0 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <div className="ml-3 w-[calc(100%-2rem)]">
                      {editingId === todo.local_id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(todo.local_id!)}
                            className="shrink-0 text-green-600 hover:text-green-800 p-1"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="shrink-0 text-gray-500 hover:text-gray-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium truncate ${
                              todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}
                            onDoubleClick={() => handleStartEditing(todo)}
                          >
                            {todo.title}
                          </span>
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditing(todo)}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(todo.local_id!)}
                              className="text-sm text-red-600 hover:text-red-800"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 border-t flex justify-between items-center">
            <span>{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</span>
            {todos.some(todo => todo.completed) && (
              <button
                onClick={() => {
                  const completedIds = todos.filter(t => t.completed).map(t => t.local_id!);
                  completedIds.forEach(id => deleteMutation.mutate(id));
                }}
                className="text-indigo-600 hover:text-indigo-800"
                disabled={deleteMutation.isPending}
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
