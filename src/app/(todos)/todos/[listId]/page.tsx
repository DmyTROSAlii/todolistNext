"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { TodoListCard } from '@/components/list-card';
import { EditListForm } from '@/components/edit-list-form';
import { CreateListForm } from '@/components/create-list-form';

import { db } from '@/app/firabase/config';
import { collection, onSnapshot, query, where } from '@firebase/firestore';

import { Task } from '@/app/types';
import { TaskCard } from '@/components/task-card';

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams()
  const listId = searchParams.get('listId')

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
      setTasks(data)
    })

    return () => unsubscribe()
  }, [listId])

  const handleEdit = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      console.log("Editing task:", taskToEdit);
      // setEditTask(taskToEdit);
      // setModalTask(true);
    }
  };

  return (
    <main className="h-full bg-gray-100 p-6">
      {/* <Modal visible={modalDelete} setVisible={setModalDelete}>
        <CreateListForm close={setModalDelete} />
      </Modal>
      <Modal visible={modalEdit} setVisible={setModalEdit}>
        <EditListForm list={editList} close={setModalEdit} />
      </Modal> */}
      <div className="flex">
        <h1 className="text-3xl font-bold mb-6">Lists</h1>
        {/* <Button onClick={() => setModalDelete(true)} className="mb-4 ml-auto">
          Create New Task
        </Button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            task={task}
          />
        ))}
      </div>
    </main>
  )
}
