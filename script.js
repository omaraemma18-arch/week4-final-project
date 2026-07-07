const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

const STORAGE_KEY = 'todoTasks';
let tasks = [];

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
};

const createTaskElement = (task) => {
  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const text = document.createElement('p');
  text.className = 'task-text';
  text.textContent = task.text;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editButton = document.createElement('button');
  editButton.className = 'edit';
  editButton.type = 'button';
  editButton.textContent = '✎';
  editButton.title = 'Edit task';
  editButton.addEventListener('click', () => editTask(task.id));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.type = 'button';
  deleteButton.textContent = '✕';
  deleteButton.title = 'Delete task';
  deleteButton.addEventListener('click', () => removeTask(task.id));

  actions.append(editButton, deleteButton);
  li.append(checkbox, text, actions);
  return li;
};

const renderTasks = () => {
  taskList.innerHTML = '';
  tasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
};

const addTask = () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now().toString(),
    text,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
};

const toggleTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
};

const removeTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
};

const editTask = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  const newText = prompt('Edit this task:', task.text);
  if (newText === null) return;

  const trimmed = newText.trim();
  if (!trimmed) return;

  tasks = tasks.map((item) =>
    item.id === id ? { ...item, text: trimmed } : item
  );

  saveTasks();
  renderTasks();
};

addButton.addEventListener('click', addTask);
 taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

loadTasks();
renderTasks();
