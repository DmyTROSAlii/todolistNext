import { CheckCircle, Circle, Pencil, Trash } from "lucide-react";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

import { db } from "@/firabase/config";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";

import { cn } from "@/lib/utils";
import { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task.id);
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const itemRef = doc(db, 'tasks', task.id);
    try {
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  const handleToggleCompleted = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Card key={task.id} className={cn("group bg-white dark:bg-[#ffffff1a] p-4 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col gap-y-2.5", task.completed && "opacity-70")}>
      <CardHeader className="p-0 flex items-center justify-between">
        <p className={cn(
          "text-sm font-semibold text-neutral-900 dark:text-zinc-100",
          task.completed && "line-through"
        )}>
          {task.title}
        </p>
        <span className="text-xs text-neutral-500 dark:text-zinc-400">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(task.createdAt))}
        </span>
      </CardHeader>

      <CardContent className="p-0 flex justify-between items-end">
        <p className={cn(
          "text-sm text-neutral-700 dark:text-zinc-300 break-words break-all",
          task.completed && "line-through"
        )}>
          {task.description || "No description provided"}
        </p>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="p-0 invisible group-hover:visible text-zinc-400 hover:text-green-500"
            onClick={handleToggleCompleted}
          >
            {task.completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-0 invisible group-hover:visible text-zinc-400 hover:text-amber-400"
            onClick={handleEdit}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-0 invisible group-hover:visible text-zinc-400 hover:text-red-600"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

    </Card>
  )
}