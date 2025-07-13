'use client'

import { useRouter } from 'next/navigation'

import { Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { db } from '@/app/firabase/config'
import { deleteDoc, doc } from '@firebase/firestore'

type TodoListCardProps = {
  id: string
  name: string
  onEdit: (id: string) => void
}

export const TodoListCard = ({
  id,
  name,
  onEdit,
}: TodoListCardProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/todos/${id}`);
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const itemRef = doc(db, 'lists', id);
    try {
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  return (
    <Card
      onClick={handleNavigate}
      className="w-full cursor-pointer transition hover:shadow-md"
    >
      <CardContent className="flex justify-between items-center p-4">
        <span className="text-lg font-semibold">{name}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};
