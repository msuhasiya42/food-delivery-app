import React, { useState } from "react";
import { TaskType } from "./Types/types";
import { Input, Modal, Select, SelectProps, message } from "antd";
import { taskAPI } from "../../Api";
import useTaskStore from "../../Store/taskStore";
import DatePicker from "react-datepicker";
import { taskPriorities } from "./utils";
import Editor from "./Editor";
import DOMPurify from "dompurify";
import useAuthStore from "../../Store/authStore";
import Comments from "./Comments";


interface EditTaskModalProps {
  task: TaskType;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTaskModal = (props: EditTaskModalProps) => {
  const { task, setShowModal, showModal } = props;

  const sanitizedTask = {
    ...task,
    description: DOMPurify.sanitize(task.description),
  };

  const [modalData, setModalData] = useState<TaskType>(sanitizedTask);
  const { tags, updateTaskDataStore, updateTaskFilteredTasksStore } = useTaskStore();
  const user = useAuthStore((state) => state?.user);


  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagsChange = (selectedTags: string[]) => {
    const newTags = tags.filter((tag) => selectedTags.includes(tag.name));
    setModalData((prevData) => ({ ...prevData, tags: newTags }));
  };

  const handleDescChange = (value: string) => {
    setModalData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleDate = (date: Date) => {
    setModalData((prevData) => ({ ...prevData, dueDate: date.toString() }));
  };

  const handleFormSubmit = () => {
    const trimmedTitle = modalData.title?.trim();
    const trimmedDescription = modalData.description?.trim();

    if (trimmedTitle === "") {
      void message.error("Title cannot be empty", 1.5);
      return;
    }

    const updatedModalData = {
      ...modalData,
      title: trimmedTitle,
      description: trimmedDescription,
      updatedAt: new Date().toString(),
    };

    setModalData(updatedModalData);

    taskAPI
      .updateTask(task._id, updatedModalData)
      .then(() => {
        void message.success("Task updated successfully", 1.5);
        const { status, _id } = updatedModalData;
        updateTaskDataStore(status, _id, updatedModalData);
        updateTaskFilteredTasksStore(status, _id, updatedModalData);
        setShowModal(false);
      })
      .catch((err) => void message.error("Error in updating task:", err));
  };

  const indianTimeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const updatedAt = new Date(task.updatedAt).toLocaleString("en-IN", indianTimeOptions);
  const createdAt = new Date(task.createdAt).toLocaleString("en-IN", indianTimeOptions);

  const tagOptions: SelectProps["options"] = tags
    .map((tag) => ({
      label: (
        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: tag.color,
              marginRight: "8px",
            }}
          />
          {tag.name}
        </span>
      ),
      value: tag.name,
    }))
    .sort((a, b) => a.label.props.children[1].localeCompare(b.label.props.children[1]));

  return (
    <Modal
      centered
      closable={false}
      title={<div className="text-lg text-center mb-6">{"Edit Task"}</div>}
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        setModalData(task);
      }}
      onOk={handleFormSubmit}
      okText="Save"
      width={750}
      okButtonProps={{ style: { backgroundColor: "#1890ff", color: "#fff" } }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div>
          <div className="w-full">
            <Input
              required
              addonBefore="Title"
              name="title"
              value={modalData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="max-w-[350px] sm:max-w-[480px] sm:w-[480px] mt-4">
            <label className="block mb-3 font-bold text-gray-700">Description</label>
            <Editor description={modalData.description} handleDescChange={handleDescChange} />
          </div>
          <div className="hidden sm:block">
            <label className="block mb-3 font-bold text-gray-700">
              Created at :<span className="text-gray-500"> {createdAt}</span>
            </label>
            <label className="block mb-3 font-bold text-gray-700">
              Last updated at :
              <span className="text-gray-500"> {updatedAt}</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col md:flex-col  gap-4">
          <div className="flex gap-4 sm:block">
            <div className="w-full">
              <label className="block mb-3 font-bold text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                aria-label="Select"
                value={modalData.status}
                onChange={handleInputChange}
              >
                <option value="todo">To do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-3 font-bold text-gray-700">Priority</label>
              <select
                id="priority"
                name="priority"
                className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                aria-label="Select"
                value={modalData.priority}
                onChange={handleInputChange}
              >
                {taskPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full">
            <label className="block mb-3 font-bold text-gray-700">Tags</label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Please select tags"
              value={modalData.tags.map((tag) => tag.name)}
              onChange={handleTagsChange}
              style={{ width: "100%" }}
              options={tagOptions}
            />
          </div>

          <div className="w-full">
            <label className="block mb-3 font-bold text-gray-700">Due Date</label>
            <DatePicker
              selected={new Date(modalData.dueDate)}
              onChange={(date: Date) => handleDate(date)}
              className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <Comments taskId={task._id} user={user!} />
    </Modal >
  );
};

export default EditTaskModal;
