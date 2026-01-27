// ===============================
// AUTH & GLOBAL STATE
// ===============================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

const agentDashboard = document.getElementById("agentDashboard");
const adminDashboard = document.getElementById("adminDashboard");

// ===============================
// DEMO CRM DATA (simulate backend)
// ===============================

const crmData = {
  months: ["January", "February", "March", "April"],

  agents: [
    {
      id: 1,
      name: "Duwaine Julies",
      email: "agent@kisasa.com",
      stats: {
        January: { leads: 40, progress: 18, completed: 12, winRate: 30 },
        February: { leads: 55, progress: 22, completed: 20, winRate: 36 },
        March: { leads: 48, progress: 19, completed: 16, winRate: 33 },
        April: { leads: 60, progress: 25, completed: 24, winRate: 40 }
      },
      tasks: [
        "Follow up pending client",
        "Prepare quotation",
        "Verify documents",
        "Client onboarding"
      ]
    },
    {
      id: 2,
      name: "Admin",
      email: "admin@kisasa.com",
      stats: {
        January: { leads: 35, progress: 14, completed: 10, winRate: 28 },
        February: { leads: 45, progress: 20, completed: 18, winRate: 40 },
        March: { leads: 52, progress: 21, completed: 20, winRate: 38 },
        April: { leads: 65, progress: 28, completed: 26, winRate: 42 }
      },
      tasks: [
        "Review agent performance",
        "Approve quotations",
        "Assign new leads"
      ]
    }
  ]
};

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  if (user.role === "admin") {
    loadAdminDashboard();
  } else {
    loadAgentDashboard();
  }

  document.getElementById("logoutBtn").addEventListener("click", logout);
});

// ===============================
// AGENT DASHBOARD
// ===============================

function loadAgentDashboard() {
  agentDashboard.style.display = "block";
  adminDashboard.style.display = "none";

  const agent = crmData.agents.find(a => a.email === user.email);
  const month = crmData.months[crmData.months.length - 1];
  const stats = agent.stats[month];

  document.getElementById("agentName").textContent = agent.name;
  document.getElementById("newLeads").textContent = stats.leads;
  document.getElementById("inProgress").textContent = stats.progress;
  document.getElementById("completedClients").textContent = stats.completed;
  document.getElementById("winRate").textContent = stats.winRate + "%";

  renderTaskList(agent.tasks);
  renderAgentChart(agent);
}

function renderTaskList(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `<span class="task-name">${task}</span>`;
    taskList.appendChild(div);
  });
}

function renderAgentChart(agent) {
  const ctx = document.getElementById("salesChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: crmData.months,
      datasets: [{
        label: "Completed Clients",
        data: crmData.months.map(m => agent.stats[m].completed),
        borderWidth: 2,
        tension: 0.4
      }]
    }
  });
}

// ===============================
// ADMIN DASHBOARD
// ===============================

function loadAdminDashboard() {
  adminDashboard.style.display = "block";
  agentDashboard.style.display = "none";

  document.getElementById("adminName").textContent = user.name;

  setupMonthSelector();
  renderAdminData(crmData.months[crmData.months.length - 1]);
}

function setupMonthSelector() {
  const selector = document.getElementById("monthSelector");
  selector.innerHTML = "";

  crmData.months.forEach(month => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    selector.appendChild(option);
  });

  selector.addEventListener("change", () => {
    renderAdminData(selector.value);
  });
}

function renderAdminData(month) {
  renderAdminStats(month);
  renderTeamOverview(month);
  renderAdminChart(month);
}

function renderAdminStats(month) {
  const container = document.getElementById("adminStats");
  container.innerHTML = "";

  const totals = crmData.agents.reduce(
    (acc, agent) => {
      acc.leads += agent.stats[month].leads;
      acc.completed += agent.stats[month].completed;
      return acc;
    },
    { leads: 0, completed: 0 }
  );

  container.innerHTML = `
    <div class="card"><p>Total Leads</p><h2>${totals.leads}</h2></div>
    <div class="card"><p>Total Completed</p><h2>${totals.completed}</h2></div>
    <div class="card"><p>Active Agents</p><h2>${crmData.agents.length}</h2></div>
    <div class="card"><p>Month</p><h2>${month}</h2></div>
  `;
}

function renderTeamOverview(month) {
  const container = document.getElementById("adminCards");
  container.innerHTML = "";

  crmData.agents.forEach(agent => {
    const s = agent.stats[month];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${agent.name}</h3>
      <p>Leads: ${s.leads}</p>
      <p>Completed: ${s.completed}</p>
      <p>Win Rate: ${s.winRate}%</p>
    `;
    container.appendChild(card);
  });
}

function renderAdminChart(month) {
  const ctx = document.getElementById("monthlyChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: crmData.agents.map(a => a.name),
      datasets: [{
        label: `Completed Clients (${month})`,
        data: crmData.agents.map(a => a.stats[month].completed),
        borderWidth: 1
      }]
    }
  });
}

// ===============================
// LOGOUT
// ===============================

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
