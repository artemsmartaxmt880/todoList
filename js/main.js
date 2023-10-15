const form = document.getElementById('form');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const tasksListItem = document.querySelectorAll('.tasksList__item')
const emptyList = document.getElementById('emptyList');
const boxDone = document.querySelector('.tasks__boxDone')
const btnRemoveAll = document.querySelector('.btn__remove');
const btnRemoveDone = document.querySelector('.btn__removeDone')
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', deleteTask);
tasksDoneList.addEventListener('click', deleteDoneTask);
tasksDoneList.addEventListener('click', moveDoneTask);
btnRemoveAll.addEventListener('click', removeAllTask);
btnRemoveDone.addEventListener('click', removeDoneTask);

let tasks = [];
let tasksDone = [];
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
};
if (localStorage.getItem('tasksDone')) {
    tasksDone = JSON.parse(localStorage.getItem('tasksDone'))
};
tasks.forEach(function (task) {
    renderTask(task);
});
tasksDone.forEach(function (task) {
    renderDoneTask(task);
});
checkEmptyList()
function checkEmptyList() {
    if (tasksList.children.length > 1) {
        emptyList.classList.add('hidden');
    }
    else {
        emptyList.classList.remove('hidden');
    }
    if (tasksDoneList.children.length > 0) {
        boxDone.classList.remove('hidden');
    }
    else {
        boxDone.classList.add('hidden');
    }

}
function addTask(event) {
    event.preventDefault()
    const taskText = taskInput.value
    if (taskText.length == 0) return;
    const task = {
        id: Date.now(),
        text: taskText,
    }
    tasks.push(task)
    renderTask(task)
    taskInput.value = '';
    taskInput.focus();
    checkEmptyList()
    saveTolocalStorage()
}
function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;
    const item = event.target.closest('li');
    const id = Number(item.id);
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });
    item.remove()
    saveTolocalStorage()
    checkEmptyList();
};
function deleteDoneTask(event) {
    if (event.target.dataset.action !== 'delete') return;
    const item = event.target.closest('li');
    const id = Number(item.id);
    tasksDone = tasksDone.filter(function (task) {
        return task.id !== id;
    });
    item.remove()
    saveTolocalStorage()
    checkEmptyList();
};
function doneTask(event) {
    if (event.target.dataset.action === 'delete') return;
    if (event.target === emptyList) return;
    if (event.target === tasksList) return;
    const item = event.target
    const id = +item.id
    const index = tasks.findIndex((task) => {
        return task.id === id;
    })
    tasksDone.push(tasks[index]);
    tasks.splice([index], 1)
    item.remove();
    const task = tasksDone[tasksDone.length - 1]
    renderDoneTask(task)
    checkEmptyList()
    saveTolocalStorage()
}
function moveDoneTask(event) {
    if (event.target.dataset.action === 'delete') return;
    if (event.target === tasksDoneList) return;
    const item = event.target
    const id = +item.id
    const index = tasksDone.findIndex((task) => {
        return task.id === id;
    })
    tasks.push(tasksDone[index]);
    tasksDone.splice([index], 1)
    item.remove();
    const task = tasks[tasks.length - 1]
    renderTask(task)
    checkEmptyList()
    saveTolocalStorage()
}
function removeDoneTask() {
    tasksDone = []
    const doneList = tasksDoneList.querySelectorAll('.tasksList__item')
    for (let i = 0; i < doneList.length; i++) {
        doneList[i].remove();
    }
    saveTolocalStorage()
    checkEmptyList()
}
function removeAllTask() {
    tasksDone = []
    const doneList = tasksDoneList.querySelectorAll('.tasksList__item')
    for (let i = 0; i < doneList.length; i++) {
        doneList[i].remove();
    }
    tasks = []
    const list = tasksList.querySelectorAll('.tasksList__item')
    for (let i = 0; i < list.length; i++) {
        list[i].remove();
    }
    saveTolocalStorage()
    checkEmptyList()
}
function saveTolocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
}
function renderTask(task) {
    const taskHTML = `
    <li class="tasksList__item" id="${task.id}">
    <div class="tasksList__text">${task.text}</div>
        <button class="btn__delete" data-action="delete">&#10008;</button>
    </li>`;
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
function renderDoneTask(task) {
    const taskHTML = `
    <li class="tasksList__item" id="${task.id}">
    <div class="tasksList__text done">${task.text}</div>
        <button class="btn__delete" data-action="delete">&#10008;</button>
    </li>`;
    tasksDoneList.insertAdjacentHTML('beforeend', taskHTML);
}
