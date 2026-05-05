let editingIndex = null;
let filter = "all";

function setFilter(value) {
  filter = value;

  renderTasks();
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (!tasks.length) {
    list.innerHTML = "<span>No Tasks... Please add your first Task</span>";
  }

  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter((t) => !t.done);
  }

  if (filter === "completed") {
    filteredTasks = tasks.filter((t) => t.done);
  }

  filteredTasks.forEach((taskObj) => {
    const index = tasks.indexOf(taskObj);

    const isEditing = editingIndex === index;

    const task = document.createElement("div");
    task.className = "task";

    task.innerHTML = `
  <input type="checkbox" ${taskObj.done ? "checked" : ""} onchange="toggleTask(${index})" />

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
          <button onclick="saveEdit(${index})">Save</button>
          <button onclick="cancelEdit()">Cancel</button>
        `
        : `
          <button onclick="startEdit(${index})">Edit</button>
          <button onclick="removeTask(${index})">X</button>
        `
    }
  </div>
`;

    list.appendChild(task);
  });
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

function startEdit(index) {
  editingIndex = index;
  renderTasks();
}

function cancelEdit() {
  editingIndex = null;
  renderTasks();
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

renderTasks();
