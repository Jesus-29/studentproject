import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import "./App.css";
import TaskForm from "./TaskForm";

function App() {
  const [tasks, setTask] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentTask, setCurrentTask] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("http://127.0.0.1:5000/tasks");
    const data = await response.json();
    setTask(data.tasks);
  };

  const closedModal = () => {
    setIsModalOpen(false);
    setCurrentTask({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openUpdateModal = (task) => {
    if (isModalOpen) return;
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const onTaskUpdate = () => {
    closedModal();
    fetchTasks();
  };
  return (
    <div>
      <h1>Tame.io</h1>
      <TaskList
        tasks={tasks}
        updateTask={openUpdateModal}
        updateCallBack={onTaskUpdate}
      />
      <button onClick={openCreateModal}>Create Task</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closedModal}>
              &times;
            </span>
            <TaskForm
              existingTask={currentTask}
              updateCallBack={onTaskUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
