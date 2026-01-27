// ======= LOGIN REDIRECT =======
const loggedInUser = JSON.parse(localStorage.getItem("loggedInAgent"));
if (!loggedInUser) {
  window.location.href = "login.html";
}

// ======= DATA =======
let agents = [
  {
    id: 1,
    name: "Agent John",
    email: "john@kisasa.com",
    stats: { leads: 12, closed: 5, winRate: "42%" },
    tasks: ["Call client A", "Send quote to B"]
  },
  {
    id: 2,
    name: "Agent Lisa",
    email: "lisa@kisasa.com",
    stats: { leads: 20, closed: 10, winRate: "50%" },
    tasks: ["Follow up C", "Call D"]
  }
];

// ======= DASHBOARD ELEMENTS =======
const agentDashboard = document.getElementById("agentDashboard");
const adminDashboard = document.getElementById("adminDashboard");

// ======= LOGOUT =======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInAgent");
  window.location.href = "login.html";
});

// ======= ROLE CHECK =======
if (loggedInUser.role === "admin") {
  agentDashboard.style.display = "none";
  adminDashboard.style.display = "block";

  document.getElementById("adminName").textContent = loggedInUser.name;

  // Admin cards (team overview)
  const adminCards = document.getElementById("adminCards");
  adminCards.innerHTML = "";
  agents.forEach(agent => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${agent.name}</h3>
      <p>Leads: ${agent.stats.leads}</p>
      <p>Closed: ${agent.stats.closed}</p>
      <p>Win Rate: ${agent.stats.winRate}</p>
    `;
    adminCards.appendChild(card);
  });

  // Populate agent selector
  const agentSelector = document.getElementById("agentSelector");
  const selectedAgentName = document.getElementById("selectedAgentName");
  const agentStatsDiv = document.getElementById("agentStats");
  const agentTasksContainer = document.getElementById("agentTasksContainer");

  function loadAgents() {
    agentSelector.innerHTML = "";
    agents.forEach(agent => {
      const opt = document.createElement("option");
      opt.value = agent.id;
      opt.textContent = agent.name;
      agentSelector.appendChild(opt);
    });
  }

  function renderAgent(agent) {
    selectedAgentName.textContent = agent.name;
    agentStatsDiv.innerHTML = `
      <div class="card"><p>Leads</p><h2>${agent.stats.leads}</h2></div>
      <div class="card"><p>Closed</p><h2>${agent.stats.closed}</h2></div>
      <div class="card"><p>Win Rate</p><h2>${agent.stats.winRate}</h2></div>
    `;

    agentTasksContainer.innerHTML = "";
    agent.tasks.forEach(t => {
      const div = document.createElement("div");
      div.className = "task-item";
      div.textContent = t;
      agentTasksContainer.appendChild(div);
    });
  }

  loadAgents();
  renderAgent(agents[0]);

  agentSelector.addEventListener("change", e => {
    const agent = agents.find(a => a.id == e.target.value);
    renderAgent(agent);
  });

  // ADD AGENT MODAL
  const addAgentModal = document.getElementById("addAgentModal");
  const addAgentBtn = document.getElementById("addAgentBtn");
  const closeAgentModal = document.getElementById("closeAgentModal");
  const saveAgentBtn = document.getElementById("saveAgentBtn");
  const newAgentName = document.getElementById("newAgentName");
  const newAgentEmail = document.getElementById("newAgentEmail");

  addAgentBtn.onclick = () => addAgentModal.style.display = "flex";
  closeAgentModal.onclick = () => addAgentModal.style.display = "none";

  saveAgentBtn.onclick = () => {
    if (newAgentName.value && newAgentEmail.value) {
      const newAgent = {
        id: Date.now(),
        name: newAgentName.value,
        email: newAgentEmail.value,
        stats: { leads: 0, closed: 0, winRate: "0%" },
        tasks: []
      };
      agents.push(newAgent);
      loadAgents();
      renderAgent(newAgent);
      addAgentModal.style.display = "none";
      newAgentName.value = "";
      newAgentEmail.value = "";
    } else {
      alert("Please fill in all fields");
    }
  };

} else {
  // ======= AGENT DASHBOARD =======
  agentDashboard.style.display = "block";
  adminDashboard.style.display = "none";

  document.getElementById("agentName").textContent = loggedInUser.name;

  // Example stats
  const agentData = agents.find(a => a.email === loggedInUser.email) || { stats: { leads: 0, closed: 0, winRate: "0%" }, tasks: [] };
  document.getElementById("newLeads").textContent = agentData.stats.leads;
  document.getElementById("inProgress").textContent = 6;
  document.getElementById("completedClients").textContent = agentData.stats.closed;
  document.getElementById("winRate").textContent = agentData.stats.winRate;

  // Tasks
  const taskList = document.getElementById("taskList");
  agentData.tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.textContent = t;
    taskList.appendChild(div);
  });

  // Chart example
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
