let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const LOCAL_STORAGE_KEY = "toDoTasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return Array.isArray(parsed) && parsed.length ? parsed : items;
  } catch {
    return items;
  }
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content
    .querySelector(".to-do__item")
    .cloneNode(true);

  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const newItemElement = createItem(textElement.textContent);
    listElement.prepend(newItemElement);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();

    const range = document.createRange();
    range.selectNodeContents(textElement);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    saveTasks(getTasksFromDOM());
  });

  textElement.addEventListener("paste", (evt) => {
    evt.preventDefault();
    const text = (evt.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, text);
  });

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((el) => tasks.push(el.textContent));
  return tasks;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

items = loadTasks();
items.forEach((task) => {
  const itemElement = createItem(task);
  listElement.append(itemElement);
});

formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const taskText = inputElement.value.trim();
  if (taskText === "") {
    inputElement.value = "";
    return;
  }

  const newItemElement = createItem(taskText);
  listElement.prepend(newItemElement);

  items = getTasksFromDOM();
  saveTasks(items);

  inputElement.value = "";
});