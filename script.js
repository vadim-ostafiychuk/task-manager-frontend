// STATE
let editingIndex = null;
let filter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let searchQuery = "";

document.getElementById("taskList").addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = e.target.dataset.action;
  const index = e.target.dataset.index;

  if (!action) return;

  switch (action) {
    case "save": {
      saveEdit(+index);

      break;
    }
    case "cancel": {
      cancelEdit();

      break;
    }
    case "edit": {
      startEdit(+index);

      break;
    }
    case "delete": {
      removeTask(+index);

      break;
    }
    case "toggle": {
      toggleTask(index);
      break;
    }
  }
});

const handleSearch = debounce((e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
}, 300);

document.getElementById("searchInput").addEventListener("input", handleSearch);

//Actions
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value;

  if (!text) return;

  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();

  input.value = "";
}

function saveEdit(index) {
  const input = document.getElementById(`editInput-${index}`);
  const newText = input.value.trim();

  if (!newText) return;

  tasks[index].text = newText;
  editingIndex = null;

  saveTasks();
  renderTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

// UI Actions

function setFilter(value) {
  filter = value;

  renderTasks();
}

function startEdit(index) {
  editingIndex = index;
  renderTasks();
}

function cancelEdit() {
  editingIndex = null;
  renderTasks();
}

// UI
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (!tasks.length && filter === "all") {
    list.innerHTML = "<span>No Tasks... Please add your first Task</span>";
    return;
  }

  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter((t) => !t.done);
  }

  if (filter === "completed") {
    filteredTasks = tasks.filter((t) => t.done);
  }

  if (!filteredTasks.length) {
    list.innerHTML = "<span>No tasks for this filter</span>";
    return;
  }

  if (searchQuery) {
    filteredTasks = filteredTasks.filter((t) =>
      t.text.toLowerCase().includes(searchQuery),
    );

    if (!filteredTasks.length) {
      list.innerHTML = "<span>No tasks for this search</span>";
      return;
    }
  }

  filteredTasks.forEach((taskObj) => {
    const index = tasks.indexOf(taskObj);

    const isEditing = editingIndex === index;

    const task = document.createElement("div");
    task.className = "task";

    task.innerHTML = `
  <input type="checkbox" ${taskObj.done ? "checked" : ""} data-action="toggle" data-index="${index}" />

  ${
    isEditing
      ? `<input id="editInput-${index}" value="${taskObj.text}" />`
      : `<span style="${taskObj.done ? "text-decoration: line-through; opacity:0.6;" : ""}">
          ${taskObj.text}
        </span>`
  }

  <div>
    ${
      isEditing
        ? `
          <button data-action="save" data-index="${index}">Save</button>
          <button data-action="cancel" data-index="${index}">Cancel</button>
        `
        : `
          <button data-action="edit" data-index="${index}">Edit</button>
          <button data-action="delete" data-index="${index}">X</button>
        `
    }
  </div>
`;

    list.appendChild(task);
  });
}

renderTasks();


//UTILLS
function debounce(fn, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}