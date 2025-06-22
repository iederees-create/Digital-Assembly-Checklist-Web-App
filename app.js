let currentUser = null;
let tasks = [
  {
    id: 't1',
    serialNumber: 'SN00123',
    assignedTo: 'assembler',
    status: 'in_progress',
    steps: [
      { title: 'Install motherboard', status: 'pending' },
      { title: 'Connect power cables', status: 'pending' },
      { title: 'Secure case', status: 'pending' }
    ]
  },
  {
    id: 't2',
    serialNumber: 'SN00124',
    assignedTo: 'assembler',
    status: 'completed',
    steps: [
      { title: 'Install motherboard', status: 'completed' },
      { title: 'Connect power cables', status: 'completed' },
      { title: 'Secure case', status: 'completed' }
    ]
  }
];

function login() {
  const role = document.getElementById('user-select').value;
  currentUser = { name: role === 'assembler' ? 'John' : 'Sarah', role };
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach(task => {
    if (task.assignedTo === currentUser.role || currentUser.role === 'qa_lead') {
      const div = document.createElement('div');
      div.className = 'task-card';
      div.innerHTML = `
        <strong>${task.serialNumber}</strong><br>
        Status: ${task.status}<br>
        <small>Click to view checklist</small>
      `;
      div.onclick = () => openChecklist(task.id);
      list.appendChild(div);
    }
  });
}

function openChecklist(taskId) {
  const task = tasks.find(t => t.id === taskId);
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('checklist').classList.remove('hidden');
  document.getElementById('serial-number').textContent = task.serialNumber;

  const stepList = document.getElementById('step-list');
  stepList.innerHTML = '';

  task.steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${step.title} 
      <button onclick="markDone('${taskId}', ${index})">Done</button>
      <button onclick="markFailed('${taskId}', ${index})">Fail</button>
      <span style="color:${step.status === 'done' ? 'green' : step.status === 'failed' ? 'red' : 'gray'}">
        (${step.status})
      </span>
    `;
    stepList.appendChild(li);
  });
}

function markDone(taskId, stepIndex) {
  const task = tasks.find(t => t.id === taskId);
  task.steps[stepIndex].status = 'done';
  openChecklist(taskId);
}

function markFailed(taskId, stepIndex) {
  const task = tasks.find(t => t.id === taskId);
  task.steps[stepIndex].status = 'failed';
  openChecklist(taskId);
}

function submitTask() {
  // For demo purposes, just approve all steps
  const task = tasks.find(t => t.id === currentTaskId);
  task.status = 'pending_qa';
  alert('Task submitted for QA review.');
  goBack();
}

function goBack() {
  document.getElementById('checklist').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  renderTasks();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker Registered'))
      .catch(err => console.log('SW registration failed:', err));
  });
}
