"use client";

import { useState, FormEvent, useEffect } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { db } from "@/app/firabase/config";
import { doc, updateDoc } from "@firebase/firestore";

import { Task } from "@/app/types";

interface CreateTaskFormProps {
  task: Task | null;
  close: (visible: boolean) => void;
}

export const EditTaskForm = ({ task, close }: CreateTaskFormProps) => {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setError("");
    }
  }, [task]);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Усі поля обов’язкові для заповнення.");
      return;
    }

    try {
      const docRef = doc(db, 'tasks', task!.id);
      await updateDoc(docRef, { title, description });
      close(false);
    } catch (err) {
      console.error("Помилка при оновленні:", err);
      setError("Не вдалося зберегти зміни.");
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-3 text-center">
        <CardTitle className="w-full text-xl font-bold">Оновити завдання</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleEdit}>
          <div className="flex flex-col gap-y-3">
            <Input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введіть новий заголовок"
              className="w-full"
            />
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введіть опис завдання"
              className="w-full min-h-[120px] p-2 border rounded-md resize-none break-words"
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <div className="flex items-center justify-center mt-2">
              <Button type="submit" size="lg">
                Підтвердити
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};