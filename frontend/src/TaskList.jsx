import React, { useState, useEffect } from "react";
import "./App.css";

const TaskList = ({ tasks, updateTask, updateCallBack }) => {
  const [visibleTasks, setVisibleTasks] = useState([]);

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map((val) => parseInt(val, 10));
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Use Intl.DateTimeFormat to format time to 12-hour format (AM/PM)
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

    return formattedTime;
  };

  useEffect(() => {
    // Start by setting all rows to be hidden for the fade-in effect
    const tasksWithVisibility = tasks.map((task) => ({
      ...task,
      isVisible: false,
    }));
    setVisibleTasks(tasksWithVisibility);

    // Apply the `visible` class with a delay to trigger the fade-in effect
    const timer = setTimeout(() => {
      setVisibleTasks(tasks.map((task) => ({ ...task, isVisible: true })));
    }, 10);

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [tasks]);

  const onDelete = async (id) => {
    // Mark the task as fading out by setting `isVisible` to false
    setVisibleTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isVisible: false } : task
      )
    );

    // Wait for the transition to complete before removing the task
    setTimeout(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/delete_task/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.status === 200) {
          updateCallBack();
        } else {
          console.error("Error deleting task");
        }
      } catch (error) {
        alert(error);
      }
    }, 500); // Match the duration of the CSS transition
  };

  return (
    <div>
      <h2>Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleTasks.map((task) => (
            <tr
              key={task.id}
              className={task.isVisible ? "visible" : "fading-out"}
            >
              <td>{task.title}</td>
              <td>{task.category}</td>
              <td>{formatTime(task.start_time)}</td>
              <td>{formatTime(task.end_time)}</td>
              <td>{task.priority}</td>
              <td>
                <button
                  onClick={() => updateTask(task)}
                  style={{ marginRight: "10px" }}
                >
                  Update
                </button>
                <button onClick={() => onDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;

/*
import React from "react";
import { useState, useEffect } from "react";
import "./App.css";

const TaskList = ({ tasks, updateTask, updateCallBack }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Update the expansion state whenever tasks change
  useEffect(() => {
    setIsExpanded(tasks.length > 0);
  }, [tasks]);

  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        "http://127.0.0.1:5000/delete_task/" + id,
        options
      );
      if (response.status === 200) {
        updateCallBack();
      } else {
        console.error("Error deleting task");
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <h2>Tasks</h2>
      <table className={isExpanded ? "expanded" : ""}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.category}</td>
              <td>{task.start_time}</td>
              <td>{task.end_time}</td>
              <td>{task.priority}</td>
              <td>
                <button onClick={() => updateTask(task)}>Update</button>
                <button onClick={() => onDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
*/
