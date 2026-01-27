// Redirect to login if not logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // role: "agent" or "admin"
if (!loggedInUser) {
  window.location.href = "login.html";
}

// Example agents data with monthly stats
const agents = [
  {
    id: 1,
    name: "Agent 1",
    email: "agent1@crm.com",
    monthlyData: {
      "2026-01": { totalLeads: 50, closedLeads: 30, tasks: ["Follow up Client A", "Call Client B"] },
      "2026-02": { totalLeads: 60, closedLeads: 40, tasks: ["Send Quote to Client C"] }
    }
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@crm.com",
    monthlyData: {
      "2026-01": { totalLeads: 60, closedLeads: 40, tasks: ["Review Agent 1 tasks"] },
      "2026-02": { totalLeads: 70, closedLeads: 50, tasks: ["Approve quotes"] }
    }
  },
  {
    id: 3,
    name: "Agent 2",
    email: "agent2@crm.com",
    monthlyData: {
      "2026-01": { totalLeads: 40, closedLeads: 20, tasks: ["Call Client D"] },
      "2026-02": { totalLeads: 50, closedLeads: 30, tasks: ["Follow up Client E"] }
    }
  }
];

// Helper to calculate progress
function getProgress(data) {
  return data.totalLeads === 0 ? 0 : ((data.closedLeads / data.totalLeads) * 100).toFixed(1);
}

// DASHBOARD ELEMENTS
const agentDashboard = document.getElementById("agentDashboard");
const adminDashboard = document.getElementById("adminDashboard");
const monthSelector = document.getElementById("monthSelector");

// Set current month by default
let selectedMonth = monthSelector ? monthSelector.value : "2026-01";

// Update month selection for admin
if (monthSelector) {
  monthSelector.addEventListener("change", (e) => {
    selectedMonth = e.target.value;
    renderAdminDashboard();
  });
}

// RENDER FUNCTIONS
function renderAgentDashboard() {
  if (!agentDashboard) return;

  const agentData = agents.find(a => a.id === loggedInUser.id);
  const monthlyData = agentData.monthlyData[selectedMonth] || { totalLeads: 0, closedLeads: 0, tasks: [] };

  agentDashboard.style.display = "block";
  adminDashboard.style.display = "none";

  document.getElementById("agentName").textContent = loggedInUser.name;

  // Stats
  document.getElementById("newLeads").textContent = monthlyData.totalLeads - monthlyData.closedLeads;
  document.getElementById("inProgress").textContent = Math.floor(monthlyData.totalLeads * 0.3); // example
  document.getElementById("completedClients").textContent = monthlyData.closedLeads;
  document.getElementById("winRate").textContent = getProgress(monthlyData) + "%";

  // Tasks
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  monthlyData.tasks.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    div.innerHTML = `<div class="task-name">${task}</div><div class="task-actions"><button>✅</button></div>`;
    taskList.appendChild(div);
  });

  // Completed Clients (dummy)
  const completedList = document.getElementById("completedList");
  completedList.innerHTML = "";
  for (let i = 1; i <= monthlyData.closedLeads; i++) {
    const div = document.createElement("div");
    div.classList.add("list-item");
    div.innerHTML = `Client ${i} <span class="view-all">View</span>`;
    completedList.appendChild(div);
  }

  // Recent Leads (dummy)
  const recentLeadsContainer = document.getElementById("recentLeads");
  recentLeadsContainer.innerHTML = "";
  for (let i = 1; i <= 3; i++) {
    const div = document.createElement("div");
    div.classList.add("list-item");
    div.textContent = `Lead ${i}`;
    recentLeadsContainer.appendChild(div);
  }

  // Sales Chart
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Sales",
        data: [2, 4, 6, 9],
        borderWidth: 3,
        tension: 0.4,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderAdminDashboard() {
  if (!adminDashboard) return;

  agentDashboard.style.display = "none";
  adminDashboard.style.display = "block";

  // Admin header
  document.getElementById("adminName").textContent = loggedInUser.name;

  const adminData = agents.find(a => a.id === loggedInUser.id).monthlyData[selectedMonth];
  const adminStats = document.getElementById("adminStats");
  adminStats.innerHTML = `
    <div class="card"><p>My Leads</p><h2>${adminData.totalLeads}</h2></div>
    <div class="card"><p>Leads Closed</p><h2>${adminData.closedLeads}</h2></div>
    <div class="card"><p>Progress</p><h2>${getProgress(adminData)}%</h2></div>
  `;

  // Team overview
  const adminCards = document.getElementById("adminCards");
  adminCards.innerHTML = "";
  agents.forEach(agent => {
    const monthData = agent.monthlyData[selectedMonth] || { totalLeads: 0, closedLeads: 0 };
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${agent.name}${agent.id === loggedInUser.id ? " (You)" : ""}</h3>
      <p>Leads Closed: ${monthData.closedLeads} / ${monthData.totalLeads}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${getProgress(monthData)}%;"></div>
      </div>
    `;
    adminCards.appendChild(card);
  });

  // Optionally render tasks for each agent in a separate section
  const agentTasksContainer = document.getElementById("agentTasksContainer");
  if (agentTasksContainer) {
    agentTasksContainer.innerHTML = "";
    agents.forEach(agent => {
      const monthData = agent.monthlyData[selectedMonth] || { tasks: [] };
      const div = document.createElement("div");
      div.classList.add("agent-task-card");
      div.innerHTML = `<h4>${agent.name}</h4><ul>${monthData.tasks.map(t => `<li>${t}</li>`).join('')}</ul>`;
      agentTasksContainer.appendChild(div);
    });
  }
}

// INITIAL RENDER
if (loggedInUser.role === "admin") {
  renderAdminDashboard();
} else {
  renderAgentDashboard();
}

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});
