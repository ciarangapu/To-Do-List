// Status management module
import { getTasks, saveTasks } from './storage.js';

// Toggle task completion status
export const toggleStatus = (index) => {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  return tasks;
};

// Clear all completed tasks
export const clearCompleted = () => {
  const tasks = getTasks();
  const remainingTasks = tasks.filter(task => !task.completed);
  
  // Update indexes for remaining tasks
  remainingTasks.forEach((task, index) => {
    task.index = index;
  });
  
  saveTasks(remainingTasks);
  return remainingTasks;
};