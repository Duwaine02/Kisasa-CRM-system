// ================= LOGIN CHECK =================
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) window.location.href = "login.html";

// ================= DATA (MOCK DATA) =================
let agents = [
  {
    id: 1,
    name: "Agent John",
    email: "john@kisasa.com",
    stats: { leads: 12, inProgress: 4, closed: 5 },
    tasks: ["Call client A", "Send quote B"]
  },
  {
    id: 2,
    name: "Agent Lisa",
    email: "lisa@kisasa.com",
    stats: { leads: 20, inProgress: 6, closed: 10 },
    tasks: ["Follow up C", "Call client D"]
  }
];

// ================= ELEMENTS =================
const agentDashboard = document.getElementById("agentDashboard");
const adminDashboard = document.getElementById("adminDashboard");

// ================= LOGOUT =================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// ================= ROLE CHECK =================
if (loggedInUser.role === "admin") {
  loadAdmin();
} else {
  loadAgent();
}

// ==================================================
// ================= ADMIN DASHBOARD =================
// ==================================================
function loadAdmin() {
  agentDashboard.style.display = "none";
  adminDashboard.style.display = "block";
  document.getElementById("adminName").textContent = loggedInUser.name;

  loadAdminKPIs();
  loadAgentSelector();
  renderAgent(agents[0]);
  renderPipelineChart();
  renderAgentManagement();
}

// ===== ADMIN KPIs =====
function loadAdminKPIs() {
  const totalAgents = agents.length;
  const totalLeads = agents.reduce((s, a) => s + a.stats.leads, 0);
  const totalConverted = agents.reduce((s, a) => s + a.stats.closed, 0);
  const totalRevenue = totalConverted * 1500; // mock value

  document.getElementById("totalAgents").textContent = totalAgents;
  document.getElementById("totalLeads").textContent = totalLeads;
  document.getElementById("totalConverted").textContent = totalConverted;
  document.getElementById("totalRevenue").textContent = `R${totalRevenue}`;
}

// ===== AGENT SELECTOR =====
const agentSelector = document.getElementById("agentSelector");
agentSelector.addEventListener("change", e => {
  const agent = agents.find(a => a.id == e.target.value);
  renderAgent(agent);
});

function loadAgentSelector() {
  agentSelector.innerHTML = "";
  agents.forEach(agent => {
    const opt = document.createElement("option");
    opt.value = agent.id;
    opt.textContent = agent.name;
    agentSelector.appendChild(opt);
  });
}

// ===== RENDER AGENT STATS + TASKS =====
function renderAgent(agent) {
  document.getElementById("agentLeads").textContent = agent.stats.leads;
  document.getElementById("agentProgress").textContent = agent.stats.inProgress;
  document.getElementById("agentCompleted").textContent = agent.stats.closed;

  const winRate = agent.stats.leads
    ? Math.round((agent.stats.closed / agent.stats.leads) * 100)
    : 0;
  document.getElementById("agentWinRate").textContent = `${winRate}%`;

  const taskContainer = document.getElementById("agentTasksContainer");
  taskContainer.innerHTML = "";
  agent.tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.textContent = task;
    taskContainer.appendChild(div);
  });
}

// ===== SALES PIPELINE CHART =====
function renderPipelineChart() {
  const leads = agents.reduce((s, a) => s + a.stats.leads, 0);
  const progress = agents.reduce((s, a) => s + a.stats.inProgress, 0);
  const closed = agents.reduce((s, a) => s + a.stats.closed, 0);

  new Chart(document.getElementById("pipelineChart"), {
    type: "bar",
    data: {
      labels: ["Leads", "In Progress", "Completed"],
      datasets: [{
        data: [leads, progress, closed],
        backgroundColor: ["#60a5fa", "#facc15", "#22c55e"]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true
    }
  });
}

// ===== AGENT MANAGEMENT =====
function renderAgentManagement() {
  const container = document.getElementById("agentManagementList");
  container.innerHTML = "";

  agents.forEach(agent => {
    const row = document.createElement("div");
    row.className = "task-item";
    row.innerHTML = `
      <strong>${agent.name}</strong> – ${agent.email}
      <button class="danger-btn" data-id="${agent.id}">Remove</button>
    `;
    container.appendChild(row);
  });

  document.querySelectorAll(".danger-btn").forEach(btn => {
    btn.onclick = () => {
      agents = agents.filter(a => a.id != btn.dataset.id);
      loadAdmin();
    };
  });
}

// ===== ADD AGENT MODAL =====
const addAgentModal = document.getElementById("addAgentModal");
document.getElementById("addAgentBtn").onclick = () => addAgentModal.style.display = "flex";
document.getElementById("closeAgentModal").onclick = () => addAgentModal.style.display = "none";

document.getElementById("saveAgentBtn").onclick = () => {
  const name = document.getElementById("newAgentName").value;
  const email = document.getElementById("newAgentEmail").value;

  if (!name || !email) return alert("Fill all fields");

  agents.push({
    id: Date.now(),
    name,
    email,
    stats: { leads: 0, inProgress: 0, closed: 0 },
    tasks: []
  });

  addAgentModal.style.display = "none";
  document.getElementById("newAgentName").value = "";
  document.getElementById("newAgentEmail").value = "";

  loadAdmin();
};

// ==================================================
// ================= AGENT DASHBOARD =================
// ==================================================
function loadAgent() {
  agentDashboard.style.display = "block";
  adminDashboard.style.display = "none";

  document.getElementById("agentName").textContent = loggedInUser.name;

  const agent = agents.find(a => a.email === loggedInUser.email) || {
    stats: { leads: 0, inProgress: 0, closed: 0 },
    tasks: []
  };

  document.getElementById("newLeads").textContent = agent.stats.leads;
  document.getElementById("inProgress").textContent = agent.stats.inProgress;
  document.getElementById("completedClients").textContent = agent.stats.closed;

  const winRate = agent.stats.leads
    ? Math.round((agent.stats.closed / agent.stats.leads) * 100)
    : 0;
  document.getElementById("winRate").textContent = `${winRate}%`;

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  agent.tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.textContent = task;
    taskList.appendChild(div);
  });

  new Chart(document.getElementById("salesChart"), {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        data: [2, 4, 6, 9],
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
