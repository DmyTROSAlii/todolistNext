import { useState, FormEvent } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { addDoc, collection } from "@firebase/firestore";
import { db } from "@/firabase/config";

import { Task } from "@/lib/types";

interface CreateTaskFormProps {
  listId: string | null;
  close: (visible: boolean) => void;
}

export const CreateTaskForm = ({ listId, close }: CreateTaskFormProps) => {
  if (!listId) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        createdAt: new Date().toISOString(),
        completed: false,
        listId: listId,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      close(false);
    }
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-3 text-center">
        <CardTitle className="w-full text-xl font-bold">
          Create a new task
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
              className="w-full"
            />
            <Input
              id="title"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <Button
              type="submit"
              size="lg"
            >
              Confirm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};