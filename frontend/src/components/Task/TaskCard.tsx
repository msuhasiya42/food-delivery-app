import React, { useState } from "react";
import { TaskType, TasksProps } from "./Types/types";
import { taskAPI } from "../../Api";
import useTaskStore from "../../Store/taskStore";
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Popconfirm,
  Popover,
  message,
} from "antd";
import EditTaskModal from "./EditTaskModal";
import {
  AlignLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { convertToIndianTime, getPriorityIcon, taskPriorities } from "./utils";
import { deleteDesc, deleteText } from "../../utils/strings";

const TaskCard = ({ task, handleDelete }: TasksProps) => {
  const {
    title,
    description,
    attatchments,
    status,
    done,
    dueDate,
    priority,
    _id,
    tags,
    // startDate,
    // collaborators,
    // user,
  } = task;

  const [showModal, setShowModal] = useState(false);

  const taskDate = new Date(dueDate);
  const currentDate = new Date();

  const taskDueDay = taskDate.getDay();
  const currentDay = currentDate.getDay();

  const redOrYellow = () => (taskDueDay < currentDay ? "red" : "yellow");
  const dateColor = task.done ? "green" : redOrYellow();
  const classNameDueDate = `text-xs ml-1 w-18 bg-${dateColor}-400 text-black font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-${dateColor}-400 dark:text-white border border-white-600  `;

  const { updateTaskDataStore, updateTaskFilteredTasksStore } = useTaskStore();

  const toggleTaskDone = () => {
    task.done = !done;
    updateTask(_id, task);
  };

  const handlePriority: MenuProps["onClick"] = (e) => {
    task.priority = e.key;
    taskAPI
      .updateTask(_id, task)
      .then(() => {
        updateTaskDataStore(status, _id, task);
        updateTaskFilteredTasksStore(status, _id, task);
      })
      .catch((err) => {
        void message.error("Err in changing priority: ", err);
      });
  };

  const items: MenuProps["items"] = taskPriorities.map((priority) => ({
    label: priority,
    key: priority,
    icon: getPriorityIcon(priority),
  }));

  const priorityOptions = {
    items,
    onClick: handlePriority,
    selectable: true,
    defaultSelectedKeys: [priority],
  };

  const updateTask = (id: string, updatedTask: TaskType) => {
    taskAPI
      .updateTask(id, updatedTask)
      .then(() => {
        updatedTask.done
          ? void message.success("Task set to done.")
          : void message.warning("Task set to undone.");
        updateTaskDataStore(status, id, updatedTask);
        updateTaskFilteredTasksStore(status, id, updatedTask);
      })
      .catch((err) => {
        console.log("err in updating to done:", err);
      });
  };

  const handleDeleteFun = () => {
    handleDelete(task);
  };

  const indianTime = convertToIndianTime(dueDate);

  const content = (
    <Card onClick={(e) => e.stopPropagation()}>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="text-black"
      />
    </Card>
  );
  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(), setShowModal(true);
        }}
      >
        <div className="font-thin w-full mb-2 overflow-hidden rounded-lg shadow-lg dark:bg-gray-800 border hover:border-cyan-400 border-solid border-transparent transition duration-300 ease-in-out ">
          {/* <img
            className="w-full h-48 mt-2"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80"
            alt="NIKE AIR"
          /> */}
          <div className="ml-2">
            <div className="flex justify-between">
              <div className="w-30">
                <div className="mb-3 flex flex-wrap">
                  {tags &&
                    tags.length !== 0 &&
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xxs text-center px-2 py-1 my-1 mr-1 bg-blue-500 rounded-xl dark:bg-blue-600 dark:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <h1 className="text-sm font-extralight text-gray-400   dark:text-gray-300">
                  {title}
                </h1>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown menu={priorityOptions}>
                  <Button style={{ border: "none" }}>
                    {getPriorityIcon(priority)}
                  </Button>
                </Dropdown>
              </div>
            </div>

            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description && description?.replace(/<[^>]*>/g, "") !== "" && (
                <Popover content={content} trigger="hover">
                  <AlignLeftOutlined />
                </Popover>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between ml-1 py-2 bg-transparent">
            {/* Due Date */}
            <button
              onClick={(e) => {
                e.stopPropagation(), toggleTaskDone();
              }}
            >
              <span className={classNameDueDate}>
                {dateColor === "green" ? (
                  <CheckCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
                <p className="ml-1">{indianTime}</p>
              </span>
            </button>

            {/* links badge */}
            <div className="flex flex-row ml-2">
              {attatchments.length > 0 && (
                <>
                  <LinkOutlined />
                  <span
                    className=" mr-3 ml-2 text-left whitespace-nowrap"
                  // sidebar-toggle-item
                  >
                    {attatchments.length}
                  </span>
                </>
              )}
            </div>

            <Popconfirm
              placement="bottomLeft"
              title={deleteText}
              description={deleteDesc}
              okText={<span className="bg-blue-500 px-3 rounded-sm ">Yes</span>}
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDeleteFun();
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
              cancelText="No"
            >
              <DeleteOutlined
                className="mr-4"
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </div>
        </div>
      </div>
      <EditTaskModal
        task={task}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default TaskCard;