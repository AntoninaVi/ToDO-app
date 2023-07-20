
const darkThemeCheckbox = document.getElementById('dark-theme');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const allFilter = document.getElementById('all');
const activeFilter = document.getElementById('active');
const completedFilter = document.getElementById('completed');
const clearCompletedButton = document.getElementById('clearCompleted');

let tasks = [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.draggable = true; //  dragging
        li.dataset.index = index; 
        li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
        <button onclick="deleteTask(${index})">Delete</button>
    `;
        taskList.appendChild(li);
    });
}


function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        tasks.push({ name: taskName, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
}

function filterTasks(filter) {
    const filteredTasks = filter === 'all'
        ? tasks
        : filter === 'active'
            ? tasks.filter((task) => !task.completed)
            : tasks.filter((task) => task.completed);

    renderTasks(filteredTasks);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    renderTasks();
}

// Event listeners
taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

allFilter.addEventListener('click', () => filterTasks('all'));
activeFilter.addEventListener('click', () => filterTasks('active'));
completedFilter.addEventListener('click', () => filterTasks('completed'));
clearCompletedButton.addEventListener('click', clearCompleted);

darkThemeCheckbox.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme', darkThemeCheckbox.checked);
});

loadTasks();

// drag & drop 
let dragStartIndex;

function dragStart(event) {
    dragStartIndex = +event.target.dataset.index;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const dragEndIndex = +event.target.dataset.index;
    swapTasks(dragStartIndex, dragEndIndex);
    renderTasks();
}

function swapTasks(fromIndex, toIndex) {
    const temp = tasks[fromIndex];
    tasks[fromIndex] = tasks[toIndex];
    tasks[toIndex] = temp;
    saveTasks();
}

taskList.addEventListener('dragstart', dragStart);
taskList.addEventListener('dragover', dragOver);
taskList.addEventListener('drop', drop);

loadTasks();
