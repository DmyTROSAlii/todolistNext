"use client";

import { useState, FormEvent, useEffect } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { db } from "@/firabase/config";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";

import { List } from "@/lib/types";

interface CreateListFormProps {
  list: List | null;
  close: (visible: boolean) => void;
}

export const EditListForm = ({ list, close }: CreateListFormProps) => {
  if (!list) return null;

  const [title, setTitle] = useState(list.name);

    useEffect(() => {
      if (list) {
        setTitle(list.name);
      }
    }, [list]);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const docRef = doc(db, 'lists', list.id);

    try {
      await updateDoc(docRef, {
        name: title
      })
      setTitle("");
    } catch (err) {
      console.error('Помилка при оновленні:', err);
    } finally {
      close(false);
    }
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-3 text-center">
        <CardTitle className="w-full text-xl font-bold">
          Update List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleEdit}>
          <div className="flex flex-col gap-y-2">
            <Input
              id="list-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new name"
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