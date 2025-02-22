import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Task = ({ task, refetch }) => {
  const [editable, setEditable] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.taskTitle);

  // Update task
  const handleUpdateTask = async (taskId, e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_MAIN_URL}/update-task/${taskId}`,
        { taskTitle }
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task Updated",
          showConfirmButton: false,
          timer: 1500,
        });

        setEditable(false);
      }
    } catch (error) {
      console.log("Error while updating task data", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_MAIN_URL}/delete-task/${taskId}`
      );

      if (res.data.deletedCount > 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Task Deleted",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      }
    } catch (error) {
      console.log("Error while deleting task data", error);
    }
  };

  return (
    <div className="bg-yellow-400 py-4 px-5 mb-3 rounded-lg ">
      <form className="flex items-center justify-between">
        <div className="w-9/12">
          <input
            name="taskTitleValue"
            onChange={(e) => setTaskTitle(e.target.value)}
            className={`text-3xl font-bold ${editable && "border px-3 py-2"}`}
            type="text"
            value={taskTitle}
            disabled={!editable}
          />
        </div>

        <div className="w-3/12 flex justify-end">
          <div className="flex items-center gap-6 text-3xl">
            <FaEdit
              onClick={() => setEditable(!editable)}
              className="cursor-pointer"
            />
            {editable && (
              <button
                type="submit"
                onClick={(e) => handleUpdateTask(task._id, e)}
                className="bg-green-500 font-bold rounded-lg text-xl py-2 px-2 cursor-pointer"
              >
                Update
              </button>
            )}
            <MdDelete
              onClick={() => handleDeleteTask(task._id)}
              className="cursor-pointer"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Task;
