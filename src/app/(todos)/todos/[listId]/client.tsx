"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/task/task-card';
import { CreateTaskForm } from '@/components/task/create-task-form';

import { db } from '@/firabase/config';
import { collection, onSnapshot, query, where } from '@firebase/firestore';

import { Task } from '@/lib/types';
import { EditTaskForm } from '@/components/task/edit-task-form';

interface TodoListClientProps {
  listId: string;
}

export default function TodoListClient({ listId }: TodoListClientProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!listId) return;

    const q = query(
      collection(db, 'tasks'),
      where('listId', '==', listId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Task),
        id: doc.id,
      }))

      const sortedTasks = data.slice().sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
      setTasks(sortedTasks)
    })

    return () => unsubscribe()
  }, [listId])

  const handleEdit = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      console.log("Editing task:", taskToEdit);
      setEditTask(taskToEdit);
      setModalEdit(true);
    }
  };

  return (
    <main className="h-full bg-gray-100 p-6">
      <Modal visible={modalCreate} setVisible={setModalCreate}>
        <CreateTaskForm listId={listId} close={setModalCreate} />
      </Modal>
      <Modal visible={modalEdit} setVisible={setModalEdit}>
        <EditTaskForm task={editTask} close={setModalEdit} />
      </Modal>
      <div className="flex">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <Button onClick={() => setModalCreate(true)} className="mb-4 ml-auto">
          Create New Task
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </main>
  )
}
