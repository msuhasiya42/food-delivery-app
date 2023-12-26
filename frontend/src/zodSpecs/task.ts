import { z } from "zod";

export const taskSchema = z.object({
  _id: z.string(),
  title: z.string().nonempty("Title is required"),
  description: z.string().default(""),
  tag: z.string().default(""),
  done: z.boolean().default(false),
  status: z.enum(["todo", "inProgress", "completed"]),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  attatchments: z.array(z.string()).default([]),
  collaborators: z.array(z.string()).default([]),
  user: z.string(),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  __v: z.number(),
});
