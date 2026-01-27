// Redirect to login if not logged in
const loggedInAgent = JSON.parse(localStorage.getItem("loggedInAgent"));
if(!loggedInAgent){
  window.location.href = "login.html";
}

// Populate header & stats
document.getElementById("agentName").textContent = loggedInAgent.name;

const agent = {
  newLeads: 12,
  inProgress: 6,
  completed: 9,
  winRate: 75
};

document.getElementById("newLeads").textContent = agent.newLeads;
document.getElementById("inProgress").textContent = agent.inProgress;
document.getElementById("completedClients").textContent = agent.completed;
document.getElementById("winRate").textContent = agent.winRate + "%";

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

    if(task.type === "quote"){
      const btn = document.createElement("button");
      btn.innerHTML = "💼"; btn.title="Send Quote";
      btn.onclick = ()=> alert(`Opening quote page for ${task.client}`);
      actions.appendChild(btn);
    }

    if(task.type === "call"){
      const btn = document.createElement("button");
      btn.innerHTML = "📞"; btn.title="Call Client";
      btn.onclick = ()=> alert(`Phone number for ${task.client}: ${task.phone}`);
      actions.appendChild(btn);
    }

    if(task.type === "followup"){
      const btn = document.createElement("button");
      btn.innerHTML = "⏱️"; btn.title="Follow Up";
      btn.onclick = ()=> alert(`Follow up with ${task.client}`);
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
completedClients.forEach(client=>{
  const div = document.createElement("div");
  div.classList.add("list-item");
  div.innerHTML = `${client} <span class="view-all">View</span>`;
  completedList.appendChild(div);
});

// Recent Leads
const recentLeads = ["John Smith", "Sarah Adams", "Michael Brown"];
const recentLeadsContainer = document.getElementById("recentLeads");
recentLeads.forEach(lead=>{
  const div = document.createElement("div");
  div.classList.add("list-item");
  div.textContent = lead;
  recentLeadsContainer.appendChild(div);
});

// Sales Chart
const ctx = document.getElementById("salesChart").getContext("2d");
new Chart(ctx,{
  type:"line",
  data:{
    labels:["Week 1","Week 2","Week 3","Week 4"],
    datasets:[{
      label:"Sales",
      data:[2,4,6,9],
      borderWidth:3,
      tension:0.4,
      borderColor:"#2563eb",
      backgroundColor:"rgba(37,99,235,0.2)",
      fill:true
    }]
  },
  options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", ()=>{
  localStorage.removeItem("loggedInAgent");
  window.location.href = "login.html";
});
