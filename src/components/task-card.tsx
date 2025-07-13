import { Task } from "@/app/types"
import { MemberAvatar } from "./member-avatar";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {

  const handleDelete = () => {
    console.log("Delete task:", task.id);
  }

  return (
    <div>
      <li key={task.id} className="flex items-end gap-x-2.5">
        <div className="group flex flex-col gap-y-1 bg-white dark:bg-[#ffffff1a] p-4 rounded-lg shadow-sm w-full">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-semibold text-neutral-900 dark:text-zinc-100", task.completed ? "line-through" : "")}>
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
          </div>
          <div className="flex items-end justify-between">
            <p className="text-sm text-neutral-700 dark:text-zinc-300 break-words break-all">
              {task.description || "No description provided"}
            </p>
            <Button
              variant="ghost"
              className="size-8 p-0 invisible group-hover:visible text-zinc-400 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>
      </li>
    </div>
  )
}