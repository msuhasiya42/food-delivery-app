import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask } from "../../ApiCalls";
import { updateTask } from "../../ApiCalls";
import TaskAreaModal from "./TextAreaModal";
// import { todos, inprogress, completed } from "../../utils/data/static";

const TaskManager = () => {
  // const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [completed, setCompleted] = useState([]);

  const user = localStorage.getItem("userId");

  useEffect(() => {
    fetchTaskFun(user);
  }, [user]);

  // Fetch Task function
  const fetchTaskFun = async (user) => {
    fetchTask(user)
      .then((response) => {
        const fetchedTasks = response.data.tasks;

        // @Remember
        // Filter tasks into different categories
        // necessary because when we add task we need to refresh individual comp not all
        // so add we add task in particular cat. it will refresh only that comp
        setTodos(fetchedTasks.filter((task) => task.status === "Todo"));
        setInprogress(
          fetchedTasks.filter((task) => task.status === "In Progress")
        );
        setCompleted(
          fetchedTasks.filter((task) => task.status === "Completed")
        );

        // @Remember
        // setTasks(fetchedTasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addTask = (taskType, newTask) => {
    taskType === "Todo"
      ? setTodos([...todos, newTask])
      : taskType === "In Progress"
      ? setInprogress([...inprogress, newTask])
      : setCompleted([...completed, newTask]);

    console.log(todos);
  };

  // update task function
  const updateTaskFun = async (taskId, updatedTask) => {
    updateTask(taskId, updatedTask)
      .then((res) => {
        console.log(res);
        console.log("Task updated");
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  return (
    <div>
      {/* task cards */}
      <div className="p-4  sm:ml-64 ">
        <div className="p-4  border-gray-800 border-dashed rounded-lg ">
          <div className="grid grid-cols-3 gap-12 mb-4">
            {/* to do card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  To-do
                </p>
                {/* task modal */}
                <div>
                  <TaskAreaModal status={"Todo"} addTask={addTask} />
                  <TaskList
                    tasks={todos}
                    status={"Todo"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* to do card end */}

            {/* in-progress card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  In-Progress
                </p>
                <div>
                  <TaskAreaModal status={"In Progress"} addTask={addTask} />
                  <TaskList
                    tasks={inprogress}
                    status={"In Progress"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* in-progress card end*/}

            {/* completed card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  Completed
                </p>
                <div>
                  <TaskAreaModal status={"Completed"} addTask={addTask} />

                  <TaskList
                    tasks={completed}
                    status={"Completed"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* completed card end*/}
          </div>
        </div>
      </div>
      {/* task cards ends here */}
    </div>
  );
};

export default TaskManager;