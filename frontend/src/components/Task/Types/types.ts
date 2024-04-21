export type TaskCategory = "todo" | "inProgress" | "completed";

export interface TaskType {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  attatchments: string[];
  tags: string[];
  priority: string;
  status: TaskCategory;
  done: boolean;
  collaborators: string[]; 
  user: string;
  createdAt: string
  updatedAt: string
}

export interface TasksProps {
  task: TaskType;
  handleDelete: (task: TaskType) => void;
  handleTaskClick: (task: TaskType) => void;
}

export interface TaskCollection {
  todo: TaskType[];
  inProgress: TaskType[];
  completed: TaskType[];
}
