"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ChevronRightIcon } from 'lucide-react';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/task/task-card';
import { EditTaskForm } from '@/components/task/edit-task-form';
import { CreateTaskForm } from '@/components/task/create-task-form';

import { db } from '@/firabase/config';
import { collection, onSnapshot, query, where } from '@firebase/firestore';

import { Task } from '@/lib/types';
import getListNameById from '@/lib/getListNameById';
import { TeamManager } from '@/components/members/team-manager';

export default function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [listName, setListName] = useState<string>("");
  const [modalTeam, setModalTeam] = useState(false);

  const params = useParams();
  const listId = params.listId as string;

  useEffect(() => {
    if (!listId) return;

    setLoading(true);
    const fetchName = async () => {
      const name = await getListNameById(listId);
      if (name) setListName(name);
    };

    fetchName();

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

    setLoading(false);

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

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <main className="h-full bg-gray-100 p-6">
      <Modal visible={modalCreate} setVisible={setModalCreate}>
        <CreateTaskForm listId={listId} close={setModalCreate} />
      </Modal>
      <Modal visible={modalEdit} setVisible={setModalEdit}>
        <EditTaskForm task={editTask} close={setModalEdit} />
      </Modal>
      <Modal visible={modalTeam} setVisible={setModalTeam}>
        <TeamManager listId={listId} />
      </Modal>
      <div className="flex">
        <Link href="/todos">
          <p className="text-3xl font-bold mb-6">
            Lists
          </p>
        </Link>
        <ChevronRightIcon className="size-8 mt-1 text-muted-foreground" />
        <p className="text-3xl font-bold mb-6">
          {listName}
        </p>
        <div className="flex gap-2 ml-auto">
          <Button onClick={() => setModalCreate(true)} className="mb-4">
            Create New Task
          </Button>
          <Button onClick={() => setModalTeam(true)} className="mb-4">
            My Team
          </Button>
        </div>
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
