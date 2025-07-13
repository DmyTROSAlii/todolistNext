export type List = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
  listId: string;
};

export type Member = {
  id: string;
  userId: string;
  listId: string;
  role: "admin" | "member";
  email: string;
};