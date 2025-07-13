"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash, ShieldCheck, User } from "lucide-react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/firabase/config";
import { useAuthState } from "react-firebase-hooks/auth";

import { Member } from "@/lib/types";

interface TeamManagerProps {
  listId: string;
}

export const TeamManager = ({ listId }: TeamManagerProps) => {
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "members"),
      where("listId", "==", listId),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doc = snapshot.docs[0];
      const role = doc?.data()?.role;
      setIsAdmin(role === "admin");
    });

    return () => unsubscribe();
  }, [user, listId]);

  useEffect(() => {
    const q = query(collection(db, "members"), where("listId", "==", listId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const memberData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const member = docSnap.data();

          const userDoc = await getDoc(doc(db, "users", member.userId));

          const email = userDoc.exists() ? userDoc.data().email : "невідомо";

          return {
            id: docSnap.id,
            userId: member.userId,
            listId: member.listId,
            role: member.role || "member",
            email,
          };
        })
      );

      setMembers(memberData);
    });

    return () => unsubscribe();
  }, [listId]);

  const handleAdd = async () => {
    setError("");
    setLoading(true);

    try {
      const userSnap = await getDocs(
        query(collection(db, "users"), where("email", "==", emailInput))
      );

      if (userSnap.empty) {
        setError("User not found");
        return;
      }

      const user = userSnap.docs[0];
      const userId = user.id;

      const existing = members.find((m) => m.userId === userId);
      if (existing) {
        setError("User already exists in this list");
        return;
      }

      await addDoc(collection(db, "members"), {
        userId,
        listId,
        role: "member",
      });

      setEmailInput("");
    } catch (err) {
      setError("Error adding member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "members", id));
  };

  const toggleRole = async (id: string, currentRole: "admin" | "member") => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    await updateDoc(doc(db, "members", id), { role: newRole });
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex gap-2 items-center">
          <Input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email"
          />
          <Button onClick={handleAdd} disabled={loading || !emailInput}>
            Add
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded bg-gray-100 dark:bg-zinc-800"
          >
            <div>
              <p className="text-sm font-medium">{member.email}</p>
              <p className="text-xs text-muted-foreground">
                Роль: {member.role}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => toggleRole(member.id, member.role)}
              >
                {member.role === "admin" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(member.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
