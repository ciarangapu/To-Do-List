// CRUD operations module
import { getTasks, saveTasks } from './storage.js';

// Create new task
export const addTask = (description) => {
  const tasks = getTasks();
  const newTask = {
    description,
    completed: false,
    index: tasks.length
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return tasks;
};

// Read all tasks
export const getAllTasks = () => {
  return getTasks();
};

// Update task description
export const updateTask = (index, newDescription) => {
  const tasks = getTasks();
  tasks[index].description = newDescription;
  saveTasks(tasks);
  return tasks;
};

// Delete task
export const deleteTask = (index) => {
  const tasks = getTasks();
  tasks.splice(index, 1);
  // Update indexes
  tasks.forEach((task, i) => {
    task.index = i;
  });
  saveTasks(tasks);
  return tasks;
};