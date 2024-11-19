import { useState, useEffect } from "react";

const TaskForm = ({ existingTask = {}, updateCallBack }) => {
  const [title, setTitle] = useState(existingTask.title || "");
  const [category, setCategory] = useState(existingTask.category || "");
  const [startTime, setStartTime] = useState(existingTask.start_time || "");
  const [endTime, setEndTime] = useState(existingTask.end_time || "");
  const [priority, setPriority] = useState(existingTask.priority || "low");

  // Determine if we're updating or creating a task
  const updating = Object.entries(existingTask).length !== 0;

  useEffect(() => {
    if (updating) {
      setTitle(existingTask.title);
      setCategory(existingTask.category);
      setStartTime(existingTask.start_time);
      setEndTime(existingTask.end_time);
      setPriority(existingTask.priority);
    }
  }, [existingTask, updating]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      category,
      start_time: startTime,
      end_time: endTime,
      priority,
    };

    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_task/${existingTask.id}` : "create_task");

    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      // Handle errors
      if (response.status !== 200 && response.status !== 201) {
        alert(data.message || "An error occurred.");
      } else {
        updateCallBack(); // Refresh task list
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Category: </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Start Time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">End Time: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default TaskForm;

/*import { useState } from "react";

const TaskForm = ({ existingTask = {}, updateCallBack }) => {
  const [title, setTitle] = useState(existingTask.title || "");
  const [category, setCategory] = useState(existingTask.category || "");
  const [startTime, setStartTime] = useState(existingTask.start_time || "");
  const [endTime, setEndTime] = useState(existingTask.end_time || "");
  const [priority, setPriority] = useState(existingTask.priority || "low");

  const updating = Object.entries(existingTask).length !== 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      category,
      start_time: startTime,
      end_time: endTime,
      priority,
    };
    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_task/${existingTask.id}` : "create_task");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      updateCallBack();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Category: </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Start Time: </label>
        <input
          type="date"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">End Time: </label>
        <input
          type="date"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div></div>
      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default TaskForm;
*/
