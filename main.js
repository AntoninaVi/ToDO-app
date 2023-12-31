
const darkThemeCheckbox = document.getElementById('theme-swicher');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const allFilter = document.getElementById('all');

const activeFilter = document.getElementById('active');
const completedFilter = document.getElementById('completed');
const clearCompletedButton = document.getElementById('clearCompleted');
const remainingCountSpan = document.getElementById('remainingCount');


let tasks = [];
function renderTasks(filteredTasks) {
    taskList.innerHTML = '';

    const tasksToRender = filteredTasks || tasks;

    if (tasksToRender.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No tasks';
        li.classList.add('todo-app__filters-message'); //"No Tasks"
        taskList.appendChild(li);
    } else {
        tasksToRender.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add('todo-app__task-list-item');
            li.draggable = true;
            li.dataset.index = index;
            li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
            <p class="${task.completed ? 'completed' : ''}">${task.name}</p>
            <button class="delete-btn" onclick="deleteTask(${index})"></button>
        `;
            taskList.appendChild(li);
        });
    }

    const remainingCount = tasks.filter((task) => !task.completed).length;
    remainingCountSpan.textContent = remainingCount;
}

taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

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

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    renderTasks();
}
loadTasks();

//filters
function filterTasks(filter) {
    let filteredTasks;
    switch (filter) {
        case 'active':
            filteredTasks = tasks.filter((task) => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter((task) => task.completed);
            break;
        default:
            filteredTasks = tasks;
            break;
    }
    renderTasks(filteredTasks);
}

allFilter.addEventListener('click', () => filterTasks('all'));
activeFilter.addEventListener('click', () => filterTasks('active'));
completedFilter.addEventListener('click', () => filterTasks('completed'));
clearCompletedButton.addEventListener('click', () => {
    clearCompleted();
    setActiveFilter(allFilter);
});

function setActiveFilter(activeButton) {
    [allFilter, activeFilter, completedFilter].forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}
allFilter.addEventListener('click', () => {
    filterTasks('all');
    setActiveFilter(allFilter);
});

activeFilter.addEventListener('click', () => {
    filterTasks('active');
    setActiveFilter(activeFilter);
});

completedFilter.addEventListener('click', () => {
    filterTasks('completed');
    setActiveFilter(completedFilter);
});
setActiveFilter(allFilter);

//dark theme switcher/ save and load theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    darkThemeCheckbox.checked = document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    document.querySelector('link[href="dark-theme.css"]').disabled = !darkThemeCheckbox.checked;
}

darkThemeCheckbox.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme', darkThemeCheckbox.checked);
    document.querySelector('link[href="dark-theme.css"]').disabled = !darkThemeCheckbox.checked;
    localStorage.setItem('theme', darkThemeCheckbox.checked ? 'dark' : 'light');
});
loadTheme();


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

