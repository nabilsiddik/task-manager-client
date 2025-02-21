import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function App() {

  const {
    data: allTasks = [],
    refetch,
  } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const { data } = await axios.get(`
        ${import.meta.env.VITE_MAIN_URL}/tasks
      `);
      return data;
    }
  })

  console.log(allTasks)


  const handleAddTask = async (e) => {
    e.preventDefault();
    const form = e.target;
    const taskTitle = form.taskTitle.value;
    const task = {
      taskTitle,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_MAIN_URL}/task`,
        task
      );

      if (res.data.insertedId) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task Added",
          showConfirmButton: false,
          timer: 1500,
        });

        refetch()
      }
    } catch (error) {
      console.log("Error white posing task", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center text-4xl font-bold">Task Manager</h1>

      <form onSubmit={handleAddTask} className="">
        <input
          type="text"
          className="input input-bordered border w-11/12 md:w-10/12 lg:w-6/12 my-5"
          placeholder="Task Title"
          name="taskTitle"
        />
        <input
          type="submit"
          className="bg-red-500 text-white font-bold py-3 px-10 rounded-md text-xl block"
          value={"Add Task"}
        />
      </form>

      <div className="display-tasks">
        <div>
          {}
        </div>
      </div>
    </div>
  );
}

export default App;
