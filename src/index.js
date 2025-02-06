import './styles.css';
import { getAllTasks, addTask, updateTask, deleteTask } from './modules/crud.js';
import { toggleStatus, clearCompleted } from './modules/status.js';
import { initDragAndDrop } from './modules/dragDrop.js';

// Function to create todo list HTML
function createTodoList() {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = ''; // Clear existing content

  // Get tasks from storage and sort by index
  const tasks = getAllTasks().sort((a, b) => a.index - b.index);

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.draggable = true;
    li.dataset.index = index;
    
    li.innerHTML = `
      <div class="todo-content">
        <input 
          type="checkbox" 
          ${task.completed ? 'checked' : ''} 
          class="todo-checkbox"
          data-index="${index}"
        >
        <span class="todo-text ${task.completed ? 'completed' : ''}" 
          contenteditable="true" 
          data-index="${index}"
        >${task.description}</span>
      </div>
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;

    todoList.appendChild(li);
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  createTodoList();
  initDragAndDrop();

  // Add new task
  const todoInput = document.querySelector('.todo-input');
  const addBtn = document.querySelector('.add-btn');

  const handleAddTask = () => {
    const description = todoInput.value.trim();
    if (description) {
      addTask(description);
      todoInput.value = '';
      createTodoList();
    }
  };

  addBtn.addEventListener('click', handleAddTask);
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  });

  // Event delegation for task actions
  const todoList = document.getElementById('todo-list');
  
  todoList.addEventListener('change', (e) => {
    // Handle checkbox changes
    if (e.target.classList.contains('todo-checkbox')) {
      const index = parseInt(e.target.dataset.index);
      toggleStatus(index);
      createTodoList();
    }
  });
  
  todoList.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    
    // Handle delete button clicks
    if (e.target.classList.contains('delete-btn')) {
      deleteTask(index);
      createTodoList();
    }
  });

  // Handle task description editing
  todoList.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('todo-text')) {
      const index = parseInt(e.target.dataset.index);
      const newDescription = e.target.textContent.trim();
      if (newDescription) {
        updateTask(index, newDescription);
        createTodoList();
      }
    }
  });

  // Clear completed tasks
  const clearBtn = document.querySelector('.clear-btn');
  clearBtn.addEventListener('click', () => {
    clearCompleted();
    createTodoList();
  });
});