// ================= WRAP EVERYTHING IN DOMContentLoaded =================
document.addEventListener('DOMContentLoaded', () => {

  // ================= MOCK USERS =================
  const users = [
    { name: "Admin User", email: "admin@kisasa.com", role: "admin" },
    { name: "Agent John", email: "john@kisasa.com", role: "agent" },
    { name: "Agent Lisa", email: "lisa@kisasa.com", role: "agent" }
  ];

  // ================= LOGIN CHECK =================
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  console.log("Logged in as:", loggedInUser.name, loggedInUser.role);

  // ================= MOCK DATA =================
  let agents = [
    {
      id: 1,
      name: "Agent John",
      email: "john@kisasa.com",
      stats: { leads: 12, inProgress: 4, closed: 5 },
      tasks: [
        { id: "t1", client: "Lucas Black", status: "Contact" },
        { id: "t2", client: "Sarah Jones", status: "Qualified" },
        { id: "t3", client: "Mike van der Merwe", status: "New" }
      ]
    },
    {
      id: 2,
      name: "Agent Lisa",
      email: "lisa@kisasa.com",
      stats: { leads: 20, inProgress: 6, closed: 10 },
      tasks: []
    }
  ];

  // ================= ELEMENTS =================
  const agentDashboard = document.getElementById("agentDashboard");
  const adminDashboard = document.getElementById("adminDashboard");
  const logoutBtn = document.getElementById("logoutBtn");

  // ================= LOGOUT =================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }

  // ================= ROLE CHECK =================
  if (loggedInUser.role === "admin") {
    if (adminDashboard) adminDashboard.style.display = "block";
    if (agentDashboard) agentDashboard.style.display = "none";
    loadAdmin();
  } else {
    if (agentDashboard) agentDashboard.style.display = "block";
    if (adminDashboard) adminDashboard.style.display = "none";
    loadAgent();
  }

  // ==================================================
  // ================= ADMIN DASHBOARD =================
  // ==================================================
  function loadAdmin() {
    console.log("Loading admin dashboard");

    // Render agent list
    const agentList = document.getElementById("agentList");
    if (agentList) {
      agentList.innerHTML = "<h3>Agents</h3>";
      agents.forEach(a => {
        const div = document.createElement("div");
        div.textContent = `${a.name} (${a.email})`;
        agentList.appendChild(div);
      });
    }

    // Add Agent Modal logic
    const addAgentBtn = document.getElementById("addAgentBtn");
    const addAgentModal = document.getElementById("addAgentModal");
    const closeAgentModal = document.getElementById("closeAgentModal");
    const saveAgentBtn = document.getElementById("saveAgentBtn");

    if (addAgentBtn && addAgentModal) addAgentBtn.onclick = () => addAgentModal.style.display = "flex";
    if (closeAgentModal && addAgentModal) closeAgentModal.onclick = () => addAgentModal.style.display = "none";
    if (saveAgentBtn && addAgentModal) saveAgentBtn.onclick = () => {
      const name = document.getElementById("newAgentName").value.trim();
      const email = document.getElementById("newAgentEmail").value.trim();
      if (!name || !email) return alert("Please fill all fields");

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
  }

  // ==================================================
  // ================= AGENT DASHBOARD =================
  // ==================================================
  function loadAgent() {
    console.log("Loading agent dashboard");

    const agent = agents.find(a => a.email === loggedInUser.email) || {
      stats: { leads: 0, inProgress: 0, closed: 0 },
      tasks: []
    };

    console.log("Agent data:", agent);

    // Update stats
    const newLeadsEl = document.getElementById("newLeads");
    if (newLeadsEl) newLeadsEl.textContent = agent.stats.leads;

    const inProgressEl = document.getElementById("inProgress");
    if (inProgressEl) inProgressEl.textContent = agent.stats.inProgress;

    const completedEl = document.getElementById("completedClients");
    if (completedEl) completedEl.textContent = agent.stats.closed;

    const winRateEl = document.getElementById("winRate");
    const winRate = agent.stats.leads ? Math.round((agent.stats.closed / agent.stats.leads) * 100) : 0;
    if (winRateEl) winRateEl.textContent = `${winRate}%`;

    // Render tasks and leads
    renderMyTasks(agent.tasks);
    renderRecentLeads();
    renderSalesChart();

    updateTaskCounts();
  }

  // ===== BADGE CLASS HELPER =====
  function getStatusClass(status) {
    switch (status) {
      case 'Contact':
      case 'Contacted': return 'warning';
      case 'Qualified': return 'Finalise';
      case 'Done': return 'success';
      case 'Lost': return 'lost';
      default: return '';
    }
  }

  // ===== UPDATE COUNTS =====
  function updateTaskCounts() {
    const myTasksContainer = document.getElementById('taskList');
    const completedContainer = document.getElementById('completedList');

    const myCount = myTasksContainer ? myTasksContainer.querySelectorAll('.task-row').length : 0;
    const myTasksBadge = document.getElementById('myTasksCount');
    if (myTasksBadge) myTasksBadge.textContent = myCount;

    const completedCountVal = completedContainer ? completedContainer.querySelectorAll('.task-row').length : 0;
    const completedBadge = document.getElementById('completedCount');
    if (completedBadge) completedBadge.textContent = completedCountVal;
  }

  // ===== RENDER TASKS =====
  function renderMyTasks(tasks) {
    const container = document.getElementById("taskList");
    if (!container) return;
    container.innerHTML = "";
    if (!tasks.length) {
      container.innerHTML = '<p>No tasks yet</p>';
      return;
    }
    tasks.forEach(task => {
      const row = document.createElement("div");
      row.className = "task-row";
      row.dataset.taskId = task.id || 't' + Date.now();
      row.innerHTML = `
        <span>${task.client}</span>
        <span class="badge ${getStatusClass(task.status || 'New')}">${task.status || 'New'}</span>
      `;
      container.appendChild(row);
    });
  }

  // ===== RENDER RECENT LEADS =====
  function renderRecentLeads() {
    const leads = JSON.parse(localStorage.getItem('kisasa_leads') || '[]');
    const container = document.querySelector('.lead-list');
    if (!container) return;
    container.innerHTML = "";
    if (!leads.length) {
      container.innerHTML = '<p>No recent leads yet</p>';
      return;
    }
    leads.slice(0, 20).forEach(lead => {
      const row = document.createElement("div");
      row.className = "lead-row";
      row.innerHTML = `<span>${lead.firstName} ${lead.lastName}</span> <span class="badge ${getStatusClass(lead.status || 'New')}">${lead.status || 'New'}</span>`;
      container.appendChild(row);
    });

    const newLeadsEl = document.getElementById('newLeads');
    if (newLeadsEl) newLeadsEl.textContent = leads.filter(l => l.status === 'New').length || 0;
  }

  // ===== SALES CHART =====
  function renderSalesChart() {
    const chartEl = document.getElementById("salesChart");
    if (!chartEl) return;
    new Chart(chartEl, {
      type: "line",
      data: {
        labels: ["Week 1","Week 2","Week 3","Week 4"],
        datasets: [{
          data: [2,4,6,9],
          borderWidth:3,
          fill:true,
          tension:0.4,
          borderColor:"#2563eb",
          backgroundColor:"rgba(37,99,235,0.15)"
        }]
      },
      options: { plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}, responsive:true }
    });
  }

  // INITIAL RENDER
  renderRecentLeads();
  console.log("Dashboard fully loaded");

});
