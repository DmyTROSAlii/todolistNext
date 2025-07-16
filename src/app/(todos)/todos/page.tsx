"use client";

import { useEffect, useState } from 'react';

import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import { TodoListCard } from '@/components/list/list-card';
import { EditListForm } from '@/components/list/edit-list-form';
import { CreateListForm } from '@/components/list/create-list-form';

import { auth, db } from '@/firabase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

import { List } from '@/lib/types';
import { collection, doc, getDoc, onSnapshot, query, where } from '@firebase/firestore';
import Loader from '@/components/loader/loader';

export default function TodoHome() {
  const [user, loading] = useAuthState(auth);
  const [loadingData, setLoadingData] = useState(true);
  const [lists, setLists] = useState<List[]>([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [editList, setEditList] = useState<List | null>(null);

  if (!user) return null;

  useEffect(() => {
    if (!user) return;

    setLoadingData(true);

    const membersRef = collection(db, 'members');
    const membersQuery = query(membersRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(membersQuery, async (snapshot) => {
      const listIds = snapshot.docs.map(doc => doc.data().listId);

      const fetchedLists: List[] = [];

      for (const listId of listIds) {
        const listSnap = await getDoc(doc(db, 'lists', listId));
        if (listSnap.exists()) {
          const listData = listSnap.data();
          fetchedLists.push({ id: listId, name: listData.name });
        }
      }

      setLists(fetchedLists);
    });

    setLoadingData(false);

    return () => unsubscribe();
  }, [user]);

  const handleEdit = (id: string) => {
    const listToEdit = lists.find(list => list.id === id);
    if (listToEdit) {
      setEditList(listToEdit);
      setModalEdit(true);
    }
  };

  if (loading || loadingData) return <Loader />

  return (
    <main className="h-full bg-gray-100 p-6">
      <Modal visible={modalCreate} setVisible={setModalCreate}>
        <CreateListForm userId={user.uid} close={setModalCreate} />
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
