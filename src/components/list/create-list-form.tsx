import { useState, FormEvent } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "@/firabase/config";

interface CreateListFormProps {
  userId: string;
  close: (visible: boolean) => void;
}

export const CreateListForm = ({ userId, close }: CreateListFormProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await addDoc(collection(db, "lists"), {
        name: value,
      });
      await addDoc(collection(db, "members"), {
        listId: res.id,
        userId: userId,
        role: "admin",
      });
      setValue("");
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
          Create a new List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <Input
              id="list-name"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter list name"
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