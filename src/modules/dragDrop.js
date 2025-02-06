// Drag and drop functionality module
import { getTasks, saveTasks } from './storage.js';

let dragStartIndex;
let draggingElement = null;

export const initDragAndDrop = () => {
  const todoList = document.getElementById('todo-list');
  
  todoList.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.todo-item');
    if (item) {
      dragStartIndex = parseInt(item.dataset.index);
      draggingElement = item;
      
      // Set timeout to ensure dragImage is set before adding dragging class
      requestAnimationFrame(() => {
        item.classList.add('dragging');
      });
      
      // Set drag image
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(item, 20, 20);
    }
  });

  todoList.addEventListener('dragend', (e) => {
    const item = e.target.closest('.todo-item');
    if (item) {
      item.classList.remove('dragging');
      draggingElement = null;
      
      // Force a reflow to ensure proper rendering
      todoList.style.display = 'none';
      todoList.offsetHeight; // Force reflow
      todoList.style.display = '';
    }
  });

  todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggingElement) return;
    
    try {
      const afterElement = getDragAfterElement(todoList, e.clientY);
      const currentPosition = Array.from(todoList.children).indexOf(draggingElement);
      const newPosition = afterElement ? Array.from(todoList.children).indexOf(afterElement) : todoList.children.length;
      
      if (currentPosition === newPosition) return;
      
      if (afterElement) {
        todoList.insertBefore(draggingElement, afterElement);
      } else {
        todoList.appendChild(draggingElement);
      }
    } catch (error) {
      console.error('Drag over error:', error);
    }
  });

  todoList.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggingElement) return;
    
    try {
      const dragEndIndex = Array.from(todoList.children).indexOf(draggingElement);
      if (dragStartIndex !== dragEndIndex && dragEndIndex !== -1) {
        reorderTasks(dragStartIndex, dragEndIndex);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  });
};

const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
  
  if (!draggableElements.length) return null;

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
};

const reorderTasks = (startIndex, endIndex) => {
  try {
    const tasks = getTasks();
    if (startIndex >= 0 && startIndex < tasks.length && endIndex >= 0 && endIndex <= tasks.length) {
      const [removed] = tasks.splice(startIndex, 1);
      tasks.splice(endIndex, 0, removed);
      
      // Update indexes
      tasks.forEach((task, index) => {
        task.index = index;
      });
      
      saveTasks(tasks);
      return tasks;
    }
  } catch (error) {
    console.error('Reorder error:', error);
  }
  return getTasks(); // Return original tasks if reorder fails
};