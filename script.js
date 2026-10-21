const STORAGE_KEY = 'todo-list-items';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countLabel = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

function getStoredTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read tasks from localStorage:', error);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTaskCount(tasks) {
  const remaining = tasks.filter((task) => !task.completed).length;
  const taskText = remaining === 1 ? 'task' : 'tasks';
  countLabel.textContent = `${remaining} ${taskText} left`;
}

function getVisibleTasks(tasks) {
  if (currentFilter === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function renderTasks() {
  const tasks = getStoredTasks();
  const visibleTasks = getVisibleTasks(tasks);

  updateTaskCount(tasks);

  if (visibleTasks.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks here yet.</li>';
    return;
  }

  list.innerHTML = visibleTasks
    .map(
      (task) => `
        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="todo-main">
            <input
              class="todo-checkbox"
              type="checkbox"
              ${task.completed ? 'checked' : ''}
              aria-label="Mark ${task.text} complete"
            />
            <span class="todo-text">${task.text}</span>
          </div>
          <button class="task-delete" type="button" aria-label="Delete ${task.text}">Delete</button>
        </li>
      `
    )
    .join('');
}

function addTask(text) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    return;
  }

  const tasks = getStoredTasks();
  tasks.unshift({
    id: Date.now(),
    text: trimmedText,
    completed: false,
  });

  saveTasks(tasks);
  renderTasks();
}

function toggleTask(id) {
  const tasks = getStoredTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks(updatedTasks);
  renderTasks();
}

function deleteTask(id) {
  const tasks = getStoredTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  renderTasks();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.task-delete');
  const checkbox = event.target.closest('.todo-checkbox');

  const item = event.target.closest('.todo-item');
  if (!item) {
    return;
  }

  const { id } = item.dataset;

  if (deleteButton) {
    deleteTask(Number(id));
    return;
  }

  if (checkbox) {
    toggleTask(Number(id));
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((buttonElement) => {
      buttonElement.classList.toggle('active', buttonElement === button);
    });

    renderTasks();
  });
});

renderTasks();
