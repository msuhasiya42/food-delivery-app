import React, { useEffect, useState } from "react";
import TasksList from "./TasksList";
import { taskAPI } from "../../ApiCalls";
import LoadingPage from "../Loading/LoadingPage";
import useTaskStore from "../../Zustand/taskStore";
import useAuthStore from "../../Zustand/authStore";
import { taskSchema } from "../../zodSpecs/task";
import { TaskType } from "./Types/types";

export const filterTasksByStatus = (tasks: TaskType[], status: string) => {
  return tasks.filter((task) => task.status === status);
};

const TaskManager = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const { setAllTasks, setTasksDataByCategory, copyTasks, filteredTasks } =
    useTaskStore();

  const fetchAndProcessTasks = async (userId: string) => {
    try {
      setLoading(true);
      const response = await taskAPI.fetchTask(userId);
      const fetchedTasks = response.data.tasks;

      const validatedTasks = fetchedTasks.map((task: TaskType) => {
        try {
          return taskSchema.parse(task);
        } catch (error: any) {
          console.error(`Invalid task: ${error.message}`);
          return null;
        }
      });

      setAllTasks(validatedTasks);

      const todos = filterTasksByStatus(validatedTasks, "todo");
      const inprogress = filterTasksByStatus(validatedTasks, "inProgress");
      const completed = filterTasksByStatus(validatedTasks, "completed");

      setTasksDataByCategory("todo", todos);
      setTasksDataByCategory("inProgress", inprogress);
      setTasksDataByCategory("completed", completed);

      copyTasks();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchAndProcessTasks(user.userId);
    }
  }, [user]);

  return (
    <div className="border-gray-900 border-dashed rounded-lg w-full">
      {loading ? (
        <LoadingPage />
      ) : (
        <TasksList
          todo={filteredTasks.todo}
          inProgress={filteredTasks.inProgress}
          completed={filteredTasks.completed}
        />
      )}
    </div>
  );
};

export default TaskManager;
