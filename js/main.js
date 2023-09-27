const form = document.getElementById('form');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyList = document.getElementById('emptyList');
const btnRemoveAll = document.querySelector('.btn__remove');
const btnRemoveDone = document.querySelector('.btn__removeDone')
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
btnRemoveAll.addEventListener('click', removeAllTask);
btnRemoveDone.addEventListener('click', removeDoneTask);
// ! массив, каторый содержит в себе все задачи
let tasks = [];
// ! возвращаем из LocalStorage данные 
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
};
// ! и добавляем их в массив
tasks.forEach(function (task) {
    renderTask(task);
});
checkEmptyList();
function addTask(event) {
    // после submit страница перезагружается(стандартное поведение формы), поэтому
    // обьявляем параметр (event) и в собках отменяем ему это поведение
    event.preventDefault();
    // достаем текст из Input, value - это значение Input
    const taskText = taskInput.value;
    // запрещаю вводить пустое поле
    if (taskText.length == 0) return;
    // ! создаем объект описывающий эту задачу
    const newTask = {
        // ! текущая дата в ms 
        id: Date.now(),
        text: taskText,
        done: true,
    };
    // ! добавляем задачу в массив со всеми задачами
    // ! push добавляет в конец массива
    tasks.push(newTask);
    saveToLocalStorage()
    // ! меняем task на newTask
    renderTask(newTask);
    // ощищаем поле ввода поле надатия кнопки и сразу же возвращаем на него фокус
    taskInput.value = '';
    taskInput.focus();
    // ? // скрываем пустой лист и картинку, если в листе больше 1ого элемента <li>
    // ? // пишем условие
    // ? if (tasksList.children.length > 1) {
    // ?     emptyList.classList.add('hidden');
    // ? }
    checkEmptyList();
};
function deleteTask(event) {
    // если я захочу поставить img на button, на в css надо указать (pointer-events: none;) ей
    // =====================================================
    // пишем условие через data-action 
    // Если мы нажали не по кнопке delete, возващаем значение(ну и прекращаем функцию), если по кнопке,
    // то она работает дальше
    if (event.target.dataset.action !== 'delete') return;
    // метод closest поднимается вверх от элемента и проверяет каждого из родителей
    // мы ищем <li>, каторый и хотим удалить. Можно и по классу, хоть как
    const parentNode = event.target.closest('li');
    // ! удаляем задачу из данных
    // ! определяем id задачи
    const id = Number(parentNode.id);
    // * // ! находим id задачи в массиве
    // * // ! function(...) переменная, по которой обращаемся к каждому элементу массива 
    // * const index = tasks.findIndex(function (task) {
    // *     // ! тот элемент массива, который вернется с true, будит считатся найденным
    // *     // ! если не найдет, то вернет -1
    // *     return task.id === id;
    // * });
    // * // ! splice начиная с  .. , он убрал .. элемент (массивы)
    // * tasks.splice(index, 1);
    // ! те элементы массива, которые вернутся с true, попадут в новый массив
    // ! чтоб это сработало переменная должна быть объявлена через let
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });
    // ?===================
    saveToLocalStorage()
    // ?===================
    // ну и delete 
    parentNode.remove();
    // ?показываем пустой лист и картинку, если в листе 1 элемент <li>
    // ?пишем условие
    // ?if (tasksList.children.length === 1) {
    // ?    emptyList.classList.remove('hidden');
    // ?}
    checkEmptyList();
};
function doneTask(event) {
    // если я захочу поставить img на button, на в css надо указать (pointer-events: none;) ей
    // =====================================================
    // пишем условие через data-action 
    // Если мы нажали не по кнопке done, возващаем значение(ну и прекращаем функцию),
    // если по кнопке, то она работает дальше
    // *if (event.target.dataset.action !== 'done') return;
    if (event.target.dataset.action === 'delete') return;
    // ! поставил, чтоб не выдавало ошибку при нажании на пустую картинку
    if (tasksList.children.length === 1) return;
    // метод closest поднимается вверх от элемента и проверяет каждого из родителей
    // мы ищем <li> где будит <span>, в которм хотим изменить текст.
    const parentNode = event.target.closest('li');
    if (parentNode === null) return;
    const id = Number(parentNode.id);   
    // ! находим id задачи в массиве
    // ! function(...) переменная, по которой обращаемся к каждому элементу массива 
    // ! find возвращает ссыклу на элемент, тоесть мы можем работать с task
    // ! который ссылается на его же
    const task = tasks.find(function (task) {
        // ! тот элемент массива, который вернется с true, будит считатся найденным
        // ! если не найдет, то вернет -1
        return task.id === id;
    });
    const emptyImage = document.querySelector('.tasksList__image');
    if (event.target.emptyImage) return;
    task.done = !task.done;
    const done = tasks.filter(task => task.done === false);
    tasks.sort((a, b) => {
        if (a.done > b.done) {
            return -1;
        } else {
            return 1;
        };
    });
    // теперь ищем внутри <li> <span>. Можно и по классу, хоть как
    const taskTitle = parentNode.querySelector('.tasksList__text');
    taskTitle.classList.toggle('done');
    parentNode.remove();
    renderTask(task);
    // ?===================
    saveToLocalStorage()
    // ?===================
};
function removeDoneTask(event) {
    // ! удаляю из массива done 
    const done = tasks.filter(task => task.done === true)
    tasks.slice(done);
    tasks = done;
    let doneList = tasksList.querySelectorAll('.done');
    for (let i = 0, length = doneList.length; i < length; i++) {
        doneList[i].closest('li').remove();
    }
    saveToLocalStorage()
}
function removeAllTask(event) {
    // нахожу все <li>, задаю каждому task и удаляю(просто remove, как раньше, не сработало)
    tasksList.querySelectorAll('.tasksList__item').forEach(task => task.remove());
    // ! удаляю все из массива
    if (event.target.dataset.action === 'removeAll') {
        tasks = tasks.findIndex(function (task) {
            return task !== tasks;
        });
    }
    // присваиваю [], чтоб не было 0
    tasks = [];
    saveToLocalStorage()
    // *хз как сработало, взял из deleteTask
    if (tasksList.children.length < 1) {
        checkEmptyList();
    }
}
function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li class="tasksList__emptyItem" id="emptyList">
        <div class="tasksList__image">
            <img id="emptyImage" src="img/grunge.png" alt="empty">
        </div>
    </li>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListElement = document.getElementById('emptyList');
        // ! условие ? if true(удаляем): if false(возвращаем null);(тернальный апператор)
        // ! т.к если не найдется emptyListElement, то он будит равен null
        emptyListElement ? emptyListElement.remove() : null;
    }
}
function saveToLocalStorage() {
    // ! 1 агументт, по какому ключу, 2ой что(массив или объект надо
    // ! транформировать в Json строку)
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
function renderTask(task) {
    const cssClass = task.done ? "tasksList__text" : "tasksList__text done";
    // ? Эту кнопку я убрал
    // ?<button class="btn__done" data-action="done">&#10003;</button>
    const taskHTML = `
    <li class="tasksList__item" id="${task.id}">
    <div class="${cssClass}">${task.text}</div>
        <button class="btn__delete" data-action="delete">&#10008;</button>
    </li>`;
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
// console.log(tasks)