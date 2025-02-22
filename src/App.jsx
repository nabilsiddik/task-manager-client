import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Task from "./Components/Task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { authContext } from "./Contexts/AuthContext";

function App() {

  const {userSignOut} = useContext(authContext)

  const handleLogout = () => {
    userSignOut()
    .then(res => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signout successfull",
        showConfirmButton: false,
        timer: 1500,
      });
    })
  }
  

  const { data: allTasks = [], refetch } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const { data } = await axios.get(`
        ${import.meta.env.VITE_MAIN_URL}/tasks
      `);
      return data;
    },
  });

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const form = e.target;
    const taskTitle = form.taskTitle.value;

    console.log(taskTitle.length);

    if (taskTitle.length > 50) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Task Title Must be less than 50 Characters",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
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

          refetch();
        }
      } catch (error) {
        console.log("Error white posing task", error);
      }
    }
  };

  // Get all the category taskes
  const groupedTasks = {
    "to-do": allTasks.filter((task) => task.category === "to-do"),
    "in-progress": allTasks.filter((task) => task.category === "in-progress"),
    done: allTasks.filter((task) => task.category === "done"),
  };

  // Handle after drag and drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskIndex = groupedTasks[source.droppableId].findIndex(
      (task) => task._id === draggableId
    );
    if (taskIndex === -1) return;

    const task = groupedTasks[source.droppableId][taskIndex];

    groupedTasks[source.droppableId].splice(taskIndex, 1);

    groupedTasks[destination.droppableId].splice(destination.index, 0, {
      ...task,
      category: destination.droppableId,
    });

    try {
      await axios.put(
        `${import.meta.env.VITE_MAIN_URL}/update-dnd-task/${draggableId}`,
        {
          category: destination.droppableId,
        }
      );

      refetch();
    } catch (error) {
      console.error("Error updating task category:", error);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-center text-4xl font-bold">Task Manager</h1>
      <p onClick={handleLogout} className="font-bold text-center text-2xl py-4 cursor-pointer">Logout</p>
      <form onSubmit={handleAddTask} className="mb-10">
        <div className="flex justify-center items-center flex-col">
          <input
            type="text"
            className="input input-bordered border w-11/12 md:w-10/12 lg:w-6/12 my-5 py-5 px-5 text-2xl rounded-lg"
            placeholder="Task Title"
            name="taskTitle"
          />

          <input
            type="submit"
            className="bg-red-500 text-white font-bold py-5 px-10 rounded-md text-2xl block w-11/12 md:w-10/12 lg:w-6/12"
            value={"Add Task"}
          />
        </div>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="display-tasks grid 2xl:grid-cols-2 gap-5">
          {["to-do", "in-progress", "done"].map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-md"
                >
                  <h2 className="font-bold text-4xl text-center mb-4 capitalize">
                    {category.replace("-", " ")}
                  </h2>
                  {groupedTasks[category].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task task={task} refetch={refetch} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
