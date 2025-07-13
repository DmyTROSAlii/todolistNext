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