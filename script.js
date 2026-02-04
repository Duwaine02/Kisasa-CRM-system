// ================= WRAP EVERYTHING IN DOMContentLoaded =================
document.addEventListener('DOMContentLoaded', () => {
  // ================= LOGIN CHECK =================
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  console.log("Logged in as:", loggedInUser.name, loggedInUser.role);

  // ================= DATA (MOCK DATA) =================
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

  // ================= LOGOUT =================
  const logoutBtn = document.getElementById("logoutBtn");
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

    loadAdminKPIs();
    loadAgentSelector();
    renderAgent(agents[0]);
    renderPipelineChart();
    renderAgentManagement();

    const addAgentBtn = document.getElementById("addAgentBtn");
    const addAgentModal = document.getElementById("addAgentModal");
    const closeAgentModal = document.getElementById("closeAgentModal");
    const saveAgentBtn = document.getElementById("saveAgentBtn");

    if (addAgentBtn && addAgentModal) {
      addAgentBtn.onclick = () => addAgentModal.style.display = "flex";
    }
    if (closeAgentModal && addAgentModal) {
      closeAgentModal.onclick = () => addAgentModal.style.display = "none";
    }
    if (saveAgentBtn && addAgentModal) {
      saveAgentBtn.onclick = () => {
        const name = document.getElementById("newAgentName")?.value.trim();
        const email = document.getElementById("newAgentEmail")?.value.trim();

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
  }

  // (Your existing admin functions remain unchanged)

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

    // Update stats safely
    const newLeadsEl = document.getElementById("newLeads");
    if (newLeadsEl) newLeadsEl.textContent = agent.stats.leads;

    const inProgressEl = document.getElementById("inProgress");
    if (inProgressEl) inProgressEl.textContent = agent.stats.inProgress;

    const completedEl = document.getElementById("completedClients");
    if (completedEl) completedEl.textContent = agent.stats.closed;

    const winRateEl = document.getElementById("winRate");
    const winRate = agent.stats.leads ? Math.round((agent.stats.closed / agent.stats.leads) * 100) : 0;
    if (winRateEl) winRateEl.textContent = `${winRate}%`;

    // Render dynamic sections
    renderMyTasks(agent.tasks);
    renderRecentLeads();
    renderSalesChart();

    // Initial count update
    updateTaskCounts();
  }

  // ===== BADGE CLASS HELPER =====
  function getStatusClass(status) {
    switch (status) {
      case 'Contact':
      case 'Contacted':
        return 'warning';
      case 'Qualified':
        return 'Finalise';
      case 'Done':
        return 'success';
      case 'Lost':
        return 'lost';
      default:
        return ''; // New or unknown
    }
  }

  // ===== UPDATE TASK & COMPLETED COUNTS =====
  function updateTaskCounts() {
    const myTasksContainer = document.getElementById('taskList');
    const completedContainer = document.getElementById('completedList');

    const myCount = myTasksContainer ? myTasksContainer.querySelectorAll('.task-row').length : 0;
    const myTasksBadge = document.getElementById('myTasksCount');
    if (myTasksBadge) myTasksBadge.textContent = myCount;

    const completedCountVal = completedContainer ? completedContainer.querySelectorAll('.task-row').length : 0;
    const completedBadge = document.getElementById('completedCount');
    if (completedBadge) completedBadge.textContent = completedCountVal;

    console.log(`Counts updated: My Tasks = ${myCount}, Completed = ${completedCountVal}`);
  }

  // ===== RENDER MY TASKS (with dynamic "No tasks yet") =====
  function renderMyTasks(tasks) {
    const container = document.getElementById("taskList");
    if (!container) {
      console.error("My Tasks container (#taskList) not found");
      return;
    }

    container.innerHTML = "";

    if (!tasks || tasks.length === 0) {
      container.innerHTML = '<p style="color:#64748b; text-align:center; padding:20px;">No tasks yet</p>';
    } else {
      tasks.forEach(task => {
        const row = document.createElement("div");
        row.className = "task-row";
        row.dataset.taskId = task.id || 't' + Date.now();

        row.innerHTML = `
          <span>${task.client || task}</span>
          <span class="badge ${getStatusClass(task.status || 'New')}" data-status="${task.status || 'New'}">
            ${task.status || 'New'}
          </span>
          <button class="menu-btn" aria-label="Task options">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="status-menu">
            <button data-status="Contact">Contact</button>
            <button data-status="Qualified">Qualified</button>
            <button data-status="Done">Done</button>
            <button data-status="Lost">Lost</button>
          </div>
        `;

        container.appendChild(row);
      });
    }

    attachMenuListeners();
    updateTaskCounts(); // Always refresh counts after render
  }

  // ===== RENDER RECENT LEADS =====
  function renderRecentLeads() {
    const leads = JSON.parse(localStorage.getItem('kisasa_leads') || '[]');
    console.log("Recent leads loaded from storage:", leads);

    const container = document.querySelector('.lead-list');
    if (!container) {
      console.error("Recent Leads container (.lead-list) not found");
      return;
    }

    container.innerHTML = '';

    if (leads.length === 0) {
      container.innerHTML = '<p style="color:#64748b; text-align:center; padding:20px;">No recent leads yet</p>';
      return;
    }

    leads.slice(0, 20).forEach(lead => {
      const row = document.createElement('div');
      row.className = 'lead-row';
      row.dataset.leadId = lead.id || 'l' + Date.now();

      row.innerHTML = `
        <span>${lead.firstName} ${lead.lastName}</span>
        <span class="badge ${getStatusClass(lead.status || 'New')}" data-status="${lead.status || 'New'}">
          ${lead.status || 'New'}
        </span>
        <button class="menu-btn" aria-label="Lead options">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="status-menu">
          <button data-action="moveToTasks">Move to My Tasks</button>
          <button data-status="Contact">Label as Contact</button>
          <button data-status="Qualified">Label as Qualified</button>
          <button data-status="Done">Mark Done</button>
          <button data-status="Lost">Mark Lost</button>
        </div>
      `;

      container.appendChild(row);
    });

    const newLeadsEl = document.getElementById('newLeads');
    if (newLeadsEl) {
      newLeadsEl.textContent = leads.filter(l => l.status === 'New').length || 0;
    }

    attachMenuListeners();
  }

  // ===== ATTACH MENU LISTENERS (with move & count logic) =====
  function attachMenuListeners() {
    document.removeEventListener('click', closeMenus);
    document.addEventListener('click', closeMenus);

    function closeMenus(e) {
      if (!e.target.closest('.menu-btn') && !e.target.closest('.status-menu')) {
        document.querySelectorAll('.status-menu.active').forEach(m => m.classList.remove('active'));
      }
    }

    // Open/close menu
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = btn.nextElementSibling;
        document.querySelectorAll('.status-menu.active').forEach(m => {
          if (m !== menu) m.classList.remove('active');
        });
        menu.classList.toggle('active');
      });
    });

    // Handle menu clicks
    document.querySelectorAll('.status-menu button').forEach(opt => {
      opt.addEventListener('click', e => {
        const row = e.target.closest('.task-row, .lead-row');
        if (!row) return;

        const badge = row.querySelector('.badge');
        const menu = row.querySelector('.status-menu');
        menu.classList.remove('active');

        const action = e.target.dataset.action;
        const newStatus = e.target.dataset.status;

        // Move from Recent Leads to My Tasks
        if (action === 'moveToTasks') {
          const taskList = document.getElementById('taskList');
          if (taskList) {
            badge.textContent = 'New';
            badge.dataset.status = 'New';
            badge.className = 'badge';

            // Remove "No tasks yet" if present
            const noMsg = taskList.querySelector('p');
            if (noMsg && noMsg.textContent.includes('No tasks yet')) noMsg.remove();

            taskList.appendChild(row);
            updateTaskCounts();
          }
          return;
        }

        // Status change
        if (newStatus) {
          badge.textContent = newStatus;
          badge.dataset.status = newStatus;
          badge.className = `badge ${getStatusClass(newStatus)}`;

          // Move to Completed if Done or Lost
          if (newStatus === 'Done' || newStatus === 'Lost') {
            const completedList = document.getElementById('completedList');
            if (completedList) {
              completedList.appendChild(row);

              // Check if My Tasks is now empty → show "No tasks yet"
              const taskList = document.getElementById('taskList');
              if (taskList && taskList.querySelectorAll('.task-row').length === 0) {
                taskList.innerHTML = '<p style="color:#64748b; text-align:center; padding:20px;">No tasks yet</p>';
              }

              updateTaskCounts();
            }
          }
        }
      });
    });
  }

  // ===== SALES CHART =====
  function renderSalesChart() {
    const chartEl = document.getElementById("salesChart");
    if (!chartEl) return;

    new Chart(chartEl, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          data: [2, 4, 6, 9],
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)"
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
        responsive: true
      }
    });
  }

  // Run initial renders
  renderRecentLeads();
  console.log("Dashboard fully loaded");
});