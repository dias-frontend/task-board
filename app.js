let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const placeholders = document.querySelectorAll(".placeholder");

let draggedId = null;

button.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    status: "start",
  });

  save();
  render();
  input.value = "";
};

searchInput.addEventListener("input", render);

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  placeholders.forEach((p) => (p.innerHTML = ""));

  const query = searchInput.value.toLowerCase();

  tasks
    .filter((task) => task.text.toLowerCase().includes(query))
    .forEach((task) => {
      const item = document.createElement("div");
      item.className = "item";
      item.textContent = task.text;
      item.draggable = true;

      const del = document.createElement("span");
      del.textContent = "✖";
      del.className = "delete";
      del.onclick = () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        save();
        render();
      };

      item.appendChild(del);

      item.ondblclick = () => {
        const newText = prompt("Изменить:", task.text);
        if (newText) {
          task.text = newText;
          save();
          render();
        }
      };

      item.ondragstart = () => {
        draggedId = task.id;
      };

      const column = document.querySelector(
        `.column[data-status="${task.status}"] .placeholder`,
      );

      column.append(item);
    });
}

placeholders.forEach((p) => {
  p.ondragover = (e) => e.preventDefault();

  p.ondrop = () => {
    const column = p.closest(".column");
    const status = column.dataset.status;

    const task = tasks.find((t) => t.id === draggedId);
    task.status = status;

    save();
    render();
  };
});

render();
