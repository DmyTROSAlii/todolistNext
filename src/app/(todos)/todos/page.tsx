"use client";

import { useEffect, useState } from 'react';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { TodoListCard } from '@/components/list-card';
import { EditListForm } from '@/components/edit-list-form';
import { CreateListForm } from '@/components/create-list-form';

import { db } from '@/app/firabase/config';
import { collection, onSnapshot } from '@firebase/firestore';

import { List } from '@/app/types';

export default function TodoHome() {
  const [lists, setLists] = useState<List[]>([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [editList, setEditList] = useState<List | null>(null);

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'lists'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    setLists(data);
  })

  return () => unsubscribe();
  }, []);

  const handleEdit = (id: string) => {
    const listToEdit = lists.find(list => list.id === id);
    if (listToEdit) {
      setEditList(listToEdit);
      setModalEdit(true);
    }
  };

  return (
    <main className="h-full bg-gray-100 p-6">
      <Modal visible={modalCreate} setVisible={setModalCreate}>
        <CreateListForm close={setModalCreate} />
      </Modal>
      <Modal visible={modalEdit} setVisible={setModalEdit}>
        <EditListForm list={editList} close={setModalEdit} />
      </Modal>
      <div className="flex">
        <h1 className="text-3xl font-bold mb-6">Lists</h1>
        <Button onClick={() => setModalCreate(true)} className="mb-4 ml-auto">
          Create New List
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <TodoListCard
            key={list.id}
            id={list.id}
            name={list.name}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </main>
  )
}
