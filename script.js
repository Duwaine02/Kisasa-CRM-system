// Redirect to login if not logged in
const loggedInUser = JSON.parse(localStorage.getItem("loggedInAgent")); // should include role: "agent" or "admin"
if (!loggedInUser) {
  window.location.href = "login.html";
}

// Example agents data
const agents = [
  { id: 1, name: "Agent 1", totalLeads: 50, closedLeads: 30 },
  { id: 2, name: "Admin", totalLeads: 60, closedLeads: 40 },
  { id: 3, name: "Agent 2", totalLeads: 40, closedLeads: 20 }
];

// Helper function
function getProgress(agent) {
  return ((agent.closedLeads / agent.totalLeads) * 100).toFixed(1);
}

// Dashboard containers
const agentDashboard = document.getElementById("agentDashboard");
const adminDashboard = document.getElementById("adminDashboard");

if (loggedInUser.role === "admin") {
  // Admin login
  agentDashboard.style.display = "none";
  adminDashboard.style.display = "block";

  // Update admin header
  document.getElementById("adminName").textContent = loggedInUser.name;

  // Admin personal stats
  const adminData = agents.find(a => a.id === loggedInUser.id);
  const adminStats = document.getElementById("adminStats");
  adminStats.innerHTML = `
    <div class="card"><p>My Leads</p><h2>${adminData.totalLeads}</h2></div>
    <div class="card"><p>Leads Closed</p><h2>${adminData.closedLeads}</h2></div>
    <div class="card"><p>Progress</p><h2>${getProgress(adminData)}%</h2></div>
  `;

  // Render all agents
  const adminCards = document.getElementById("adminCards");
  adminCards.innerHTML = "";
  agents.forEach(agent => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.marginBottom = "10px";
    card.innerHTML = `
      <h3>${agent.name}${agent.id === loggedInUser.id ? " (You)" : ""}</h3>
      <p>Leads Closed: ${agent.closedLeads} / ${agent.totalLeads}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${getProgress(agent)}%;"></div>
      </div>
    `;
    adminCards.appendChild(card);
  });

} else {
  // Agent login
  agentDashboard.style.display = "block";
  adminDashboard.style.display = "none";

  // Populate header & stats
  document.getElementById("agentName").textContent = loggedInUser.name;

  // Example agent data (replace with dynamic data if available)
  const agentData = agents.find(a => a.id === loggedInUser.id) || {
    totalLeads: 0,
    closedLeads: 0
  };

  const agentStats = {
    newLeads: 12,
    inProgress: 6,
    completed: agentData.closedLeads,
    winRate: getProgress(agentData)
  };

  document.getElementById("newLeads").textContent = agentStats.newLeads;
  document.getElementById("inProgress").textContent = agentStats.inProgress;
  document.getElementById("completedClients").textContent = agentStats.completed;
  document.getElementById("winRate").textContent = agentStats.winRate + "%";

  // Tasks
  const tasks = [
    { type: "followup", client: "Client A", details: "Follow up with Client A" },
    { type: "quote", client: "Client B", details: "Send quotation to Client B" },
    { type: "call", client: "Client C", details: "Call Client C", phone: "0123456789" }
  ];

  const taskList = document.getElementById("taskList");
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");

      const taskName = document.createElement("div");
      taskName.classList.add("task-name");
      taskName.textContent = task.details;

      const actions = document.createElement("div");
      actions.classList.add("task-actions");

      if (task.type === "quote") {
        const btn = document.createElement("button");
        btn.innerHTML = "💼";
        btn.title = "Send Quote";
        btn.onclick = () => alert(`Opening quote page for ${task.client}`);
        actions.appendChild(btn);
      }

      if (task.type === "call") {
        const btn = document.createElement("button");
        btn.innerHTML = "📞";
        btn.title = "Call Client";
        btn.onclick = () => alert(`Phone number for ${task.client}: ${task.phone}`);
        actions.appendChild(btn);
      }

      if (task.type === "followup") {
        const btn = document.createElement("button");
        btn.innerHTML = "⏱️";
        btn.title = "Follow Up";
        btn.onclick = () => alert(`Follow up with ${task.client}`);
        actions.appendChild(btn);
      }

      taskItem.appendChild(taskName);
      taskItem.appendChild(actions);
      taskList.appendChild(taskItem);
    });
  }
  renderTasks();

  // Completed Clients
  const completedClients = ["Client X", "Client Y", "Client Z"];
  const completedList = document.getElementById("completedList");
  completedList.innerHTML = "";
  completedClients.forEach(client => {
    const div = document.createElement("div");
    div.classList.add("list-item");
    div.innerHTML = `${client} <span class="view-all">View</span>`;
    completedList.appendChild(div);
  });

  // Recent Leads
  const recentLeads = ["John Smith", "Sarah Adams", "Michael Brown"];
  const recentLeadsContainer = document.getElementById("recentLeads");
  recentLeadsContainer.innerHTML = "";
  recentLeads.forEach(lead => {
    const div = document.createElement("div");
    div.classList.add("list-item");
    div.textContent = lead;
    recentLeadsContainer.appendChild(div);
  });

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

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInAgent");
  window.location.href = "login.html";
});
