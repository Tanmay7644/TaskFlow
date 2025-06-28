const user = JSON.parse(localStorage.getItem("taskflowUser"));

if (!user) {
  location.href = "LandingPage.html";
}

document.getElementById("username").textContent = user.name;
document.getElementById("avatar").src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user.name)}`;

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || {
  todo: [],
  completed: [],
  archived: []
};

window.onload = () => {
  if (!localStorage.getItem("taskflowFetched")) {
    fetch("https://dummyjson.com/todos")
      .then(res => res.json())
      .then(data => {
        const firstFive = data.todos.slice(0, 5);
        firstFive.forEach(todo => {
          const task = {
            text: todo.todo,
            modified: new Date().toLocaleString()
          };
          if (todo.completed) {
            tasks.completed.push(task);
          } else {
            tasks.todo.push(task);
          }
        });
        localStorage.setItem("taskflowFetched", "true");
        saveTasks();
        renderTasks();
      })
      .catch(err => {
        console.error("Failed to fetch todos:", err);
        renderTasks(); // fallback
      });
  } else {
    renderTasks();
  }
};

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (!text) return;
  tasks.todo.push({
    text,
    modified: new Date().toLocaleString()
  });
  saveTasks();
  renderTasks();
  input.value = "";
}

function renderTasks() {
  ["todo", "completed", "archived"].forEach(stage => {
    const list = document.getElementById(stage + "list");
    const count = document.getElementById(stage + "Count");
    list.innerHTML = "";
    tasks[stage].forEach((task, index) => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <p>${task.text}</p>
        <small>Last Modified ${task.modified}</small>
      `;
      const actions = document.createElement("div");
      actions.className = "task-actions";
      if (stage === "todo") {
        actions.appendChild(createBtn("Mark Completed", () => moveTask("todo", "completed", index)));
        actions.appendChild(createBtn("Archive", () => moveTask("todo", "archived", index)));
      } else if (stage === "completed") {
        actions.appendChild(createBtn("Move to Todo", () => moveTask("completed", "todo", index)));
        actions.appendChild(createBtn("Archive", () => moveTask("completed", "archived", index)));
      } else if (stage === "archived") {
        actions.appendChild(createBtn("Move to Todo", () => moveTask("archived", "todo", index)));
        actions.appendChild(createBtn("Move to Completed", () => moveTask("archived", "completed", index)));
      }
      card.appendChild(actions);
      list.appendChild(card);
    });
    count.textContent = tasks[stage].length;
  });
}

function createBtn(label, onclick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = onclick;
  return btn;
}

function moveTask(from, to, index) {
  const task = tasks[from][index];
  task.modified = new Date().toLocaleString();
  tasks[to].push(task);
  tasks[from].splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function signOut() {
  localStorage.clear();
  location.href = "LandingPage.html";
}
