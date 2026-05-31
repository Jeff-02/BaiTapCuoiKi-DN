const tasksData = [
    {
        id: "T1",
        title: "Finish CS-241 problem set 04",
        view: "today",
        project: "algorithms",
        projectLabel: "Algorithms",
        projectColor: "#22d3ee",
        priority: "high",
        priorityLabel: "!!! HIGH",
        dueText: "Today · 23:59",
        dueState: "today",
        tags: ["#hard", "#graded"],
        subtasks: [
            { text: "Dijkstra implementation", done: true },
            { text: "Write proof for Q3", done: true },
            { text: "Run test cases & submit", done: false }
        ],
        notes: "Office hours moved to 4pm. Submit via Gradescope.",
        completed: false
    },
    {
        id: "T2",
        title: "Submit lab report — Operating Systems",
        view: "today",
        project: "os",
        projectLabel: "OS",
        projectColor: "#34d399",
        priority: "high",
        priorityLabel: "!!! HIGH",
        dueText: "Yesterday",
        dueState: "overdue",
        tags: ["#lab"],
        subtasks: [{ text: "Write system call analysis", done: false }],
        notes: "Kernel debugging section must be completed meticulously.",
        completed: false
    },
    {
        id: "T3",
        title: "Read Chapter 7 — Distributed Systems",
        view: "today",
        project: "distributed",
        projectLabel: "Distributed",
        projectColor: "#a78bfa",
        priority: "med",
        priorityLabel: "!! MED",
        dueText: "Today · 18:00",
        dueState: "today",
        tags: ["#reading"],
        subtasks: [],
        notes: "Focus heavily on Lamport Logical Clocks and Vector Clocks.",
        completed: false
    },
    {
        id: "T4",
        title: "Group meeting — Senior project sync",
        view: "today",
        project: "capstone",
        projectLabel: "Capstone",
        projectColor: "#fb923c",
        priority: "med",
        priorityLabel: "!! MED",
        dueText: "Today · 15:30",
        dueState: "today",
        tags: ["#meeting", "#team"],
        subtasks: [{ text: "Prepare architectural slides", done: false }],
        notes: "Meet inside Room 402 or jump onto the Discord channel link.",
        completed: false
    },
    {
        id: "T5",
        title: "Drink water & 20 min walk",
        view: "today",
        project: "personal",
        projectLabel: "Personal",
        projectColor: "#f472b6",
        priority: "low",
        priorityLabel: "LOW",
        dueText: "Today",
        dueState: "today",
        tags: ["#health", "#daily"],
        subtasks: [],
        notes: "Keep your body healthy.",
        completed: true
    },
    {
        id: "T6",
        title: "Master Google STEP 2026 Resume",
        view: "upcoming",
        project: "algorithms",
        projectLabel: "Algorithms",
        projectColor: "#22d3ee",
        priority: "high",
        priorityLabel: "!!! HIGH",
        dueText: "Tomorrow",
        dueState: "upcoming",
        tags: ["#internship", "#resume"],
        subtasks: [],
        notes: "Align experience bullet points to match recruiters' expectations.",
        completed: false
    },
    {
        id: "T7",
        title: "Renew library books",
        view: "upcoming",
        project: "personal",
        projectLabel: "Personal",
        projectColor: "#f472b6",
        priority: "low",
        priorityLabel: "LOW",
        dueText: "Tomorrow",
        dueState: "upcoming",
        tags: ["#personal"],
        subtasks: [],
        notes: "Avoid penalty fees.",
        completed: false
    },
    {
        id: "T8",
        title: "Pay rent for May",
        view: "upcoming",
        project: "personal",
        projectLabel: "Personal",
        projectColor: "#f472b6",
        priority: "high",
        priorityLabel: "!!! HIGH",
        dueText: "Fri 10 May",
        dueState: "upcoming",
        tags: ["#bill", "#finance"],
        subtasks: [],
        notes: "Send via bank transfer directly to the landlord.",
        completed: false
    }
];

let currentFilter = "today"; 
let selectedTaskId = "T1";

function updateSidebarBadges() {
    document.getElementById('count-today').textContent = tasksData.filter(t => t.view === 'today' && !t.completed).length;
    document.getElementById('count-upcoming').textContent = tasksData.filter(t => t.view === 'upcoming' && !t.completed).length;
    document.getElementById('count-inbox').textContent = tasksData.filter(t => !t.completed).length;
    document.getElementById('count-completed').textContent = tasksData.filter(t => t.completed).length;
}

function selectSidebarItem(item) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    currentFilter = item.getAttribute('data-view') || 'today';
    document.getElementById('main-title').textContent = item.querySelector('.label').textContent.toUpperCase();

    const firstActiveTask = tasksData.find(t => currentFilter === 'inbox' || t.view === currentFilter || t.project === currentFilter);
    if (firstActiveTask) selectedTaskId = firstActiveTask.id;

    renderTasks();
    renderRightDetailPanel();
}

function toggleTaskCompleted(taskId) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    updateSidebarBadges();
    renderTasks();
    renderRightDetailPanel();
}

function renderTasks() {
    const container = document.getElementById('task-list-container');
    container.innerHTML = ""; 

    let filtered = [];
    if (["today", "upcoming", "inbox", "completed"].includes(currentFilter)) {
        if (currentFilter === "inbox") filtered = tasksData;
        else if (currentFilter === "completed") filtered = tasksData.filter(t => t.completed);
        else filtered = tasksData.filter(t => t.view === currentFilter);
    } else {
        filtered = tasksData.filter(t => t.project === currentFilter);
    }
    const overdueTasks = filtered.filter(t => t.dueState === "overdue" && !t.completed);
    const normalTasks = filtered.filter(t => t.dueState !== "overdue" || t.completed);

    if (overdueTasks.length > 0) {
        let groupHtml = `
            <div class="task-group">
                <div class="group-head">
                    <span class="gtitle" style="color: #fb7185;">OVERDUE</span>
                    <span class="gcount">[0${overdueTasks.length}]</span>
                    <div class="grule"></div>
                </div>
        `;
        overdueTasks.forEach(task => { groupHtml += generateTaskRowHtml(task); });
        groupHtml += `</div>`;
        container.innerHTML += groupHtml;
    }

    if (normalTasks.length > 0) {
        let titleLabel = currentFilter.toUpperCase();
        let titleColor = "#5eead4";
        if (currentFilter === "today") titleLabel = "TODAY · 07 MAY 2026";
        if (currentFilter === "upcoming") { titleLabel = "UPCOMING"; titleColor = "#71717a"; }

        let groupHtml = `
            <div class="task-group">
                <div class="group-head">
                    <span class="gtitle" style="color: ${titleColor};">${titleLabel}</span>
                    <span class="gcount">[0${normalTasks.length}]</span>
                    <div class="grule"></div>
                </div>
        `;
        normalTasks.forEach(task => { groupHtml += generateTaskRowHtml(task); });
        groupHtml += `</div>`;
        container.innerHTML += groupHtml;
    }

    document.querySelectorAll('.task-row').forEach(row => {
        row.addEventListener('click', function() {
            selectedTaskId = this.getAttribute('data-id');
            document.querySelectorAll('.task-row').forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            renderRightDetailPanel();
        });
    });

    document.querySelectorAll('.task-row .checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function(event) {
            event.stopPropagation();
            const taskId = this.closest('.task-row')?.getAttribute('data-id');
            if (taskId) toggleTaskCompleted(taskId);
        });
    });
}

function generateTaskRowHtml(task) {
    const isSelected = task.id === selectedTaskId ? "selected" : "";
    const isDoneRow = task.completed ? "done-row" : "";
    const isDoneText = task.completed ? "done-text" : "";
    const isChecked = task.completed ? "checked" : "";
    const checkSymbol = task.completed ? "✓" : "";

    let tagsHtml = "";
    task.tags.forEach(t => { tagsHtml += `<span class="tag">${t}</span>`; });

    let subtaskMeta = task.subtasks.length > 0 ? `<span class="meta">[${task.subtasks.filter(s => s.done).length}/${task.subtasks.length}]</span>` : "";
    let dueClass = task.dueState === "overdue" ? "due-overdue" : (task.dueState === "today" ? "due-today" : "due-upcoming");

    return `
        <div class="task-row ${isSelected} ${isDoneRow}" data-id="${task.id}">
            <div class="checkbox ${isChecked}">${checkSymbol}</div>
            <div class="pri ${task.priority}"></div>
            <span class="title ${isDoneText}">${task.title}</span>
            <div class="task-right">
                ${subtaskMeta}
                ${tagsHtml}
                <span class="proj"><span class="dot" style="background:${task.projectColor}"></span>${task.projectLabel}</span>
                <span class="${dueClass}">${task.dueText}</span>
            </div>
        </div>
    `;
}

function renderRightDetailPanel() {
    const panel = document.getElementById('detail-panel');
    const task = tasksData.find(t => t.id === selectedTaskId);

    if (!task) {
        panel.innerHTML = `<div class="detail-header">SELECT A TASK TO VIEW DETAILS</div>`;
        return;
    }

    let tagsHtml = "";
    task.tags.forEach(t => { tagsHtml += `<span class="tag">${t}</span>`; });

    let subtasksListHtml = "";
    let doneSub = 0;
    task.subtasks.forEach(sub => {
        if (sub.done) doneSub++;
        const isSubDoneClass = sub.done ? "done" : "";
        const isSubChecked = sub.done ? "checked" : "";
        const subTick = sub.done ? "✓" : "";
        subtasksListHtml += `
            <div class="subtask-item ${isSubDoneClass}">
                <span class="checkbox ${isSubChecked}">${subTick}</span>
                <span class="subtask-text">${sub.text}</span>
            </div>
        `;
    });

    let progressPercent = task.subtasks.length > 0 ? Math.round((doneSub / task.subtasks.length) * 100) : 0;

    panel.innerHTML = `
        <div class="detail-header">TASK / ${task.id}</div>
        <h2 class="detail-title">${task.title}</h2>

        <div class="detail-meta">
            <div class="meta-row">
                <span class="meta-label">STATUS</span>
                <span class="meta-value">${task.completed ? "■ COMPLETED" : "■ ACTIVE"}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">PROJECT</span>
                <span class="meta-value" style="color: ${task.projectColor};">
                    <span class="dot" style="background: ${task.projectColor};"></span> ${task.projectLabel}
                </span>
            </div>
            <div class="meta-row">
                <span class="meta-label">DUE</span>
                <span class="meta-value" style="color: #fafafa;">${task.dueText}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">PRIORITY</span>
                <span class="meta-value" style="color: ${task.priority === 'high' ? '#fb7185' : '#fbbf24'};">${task.priorityLabel}</span>
            </div>
            <div class="meta-row" style="border-bottom: none;">
                <span class="meta-label">TAGS</span>
                <span class="meta-value">${tagsHtml}</span>
            </div>
        </div>

        <div class="subtasks-section">
            <div class="subtasks-header">
                <span>SUBTASKS [${doneSub}/${task.subtasks.length}]</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                </div>
            </div>
            <div class="subtask-list">
                ${subtasksListHtml}
                <div class="add-subtask">+ ADD SUBTASK</div>
            </div>
        </div>

        <div class="notes-section">
            <div class="notes-header">NOTES</div>
            <div class="notes-content">${task.notes}</div>
        </div>

        <div class="action-buttons">
            <button class="action-btn">
                <span class="btn-icon">↵</span>
                <span class="btn-text">COMPLETE</span>
            </button>
            <button class="action-btn">
                <span class="btn-icon">E</span>
                <span class="btn-text">EDIT</span>
            </button>
            <button class="action-btn">
                <span class="btn-icon">⌫</span>
                <span class="btn-text">DELETE</span>
            </button>
        </div>
    `;
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        selectSidebarItem(this);
    });
});

const newProjectButton = document.querySelector('.add-new');
if (newProjectButton) {
    newProjectButton.addEventListener('click', () => {
        const projectName = prompt('Nhập tên project mới:', 'New Project');
        if (!projectName) return;

        const normalized = projectName.trim();
        if (!normalized) return;

        const viewSlug = normalized.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (document.querySelector(`.menu-item[data-view="${viewSlug}"]`)) {
            alert('Project đã tồn tại.');
            return;
        }

        const projectRow = document.createElement('div');
        projectRow.className = 'side-row menu-item';
        projectRow.setAttribute('data-view', viewSlug);
        projectRow.innerHTML = `<span class="glyph"><span class="dot" style="background:#7c3aed"></span></span><span class="label">${normalized}</span><span class="count">0</span>`;
        newProjectButton.insertAdjacentElement('beforebegin', projectRow);
        projectRow.addEventListener('click', function() {
            selectSidebarItem(this);
        });

        selectSidebarItem(projectRow);
    });
}

const taskModal = document.getElementById('task-modal');
document.getElementById('open-modal-btn').addEventListener('click', () => taskModal.classList.add('open'));
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => taskModal.classList.remove('open'));
});
const commandPalette = document.getElementById('command-palette');
const openPaletteBtn = document.getElementById('open-palette-btn');
const paletteSearchInput = document.getElementById('palette-search');

openPaletteBtn.addEventListener('click', () => {
    commandPalette.classList.add('open');
    setTimeout(() => paletteSearchInput.focus(), 50); // Tự động tập trung con trỏ chuột vào ô tìm kiếm nhanh
});

document.querySelectorAll('.close-palette').forEach(btn => {
    btn.addEventListener('click', () => commandPalette.classList.remove('open'));
});

document.getElementById('palette-cmd-new').addEventListener('click', () => {
    commandPalette.classList.remove('open');
    taskModal.classList.add('open');
});

document.querySelectorAll('.palette-options .palette-item[data-target]').forEach(item => {
    item.addEventListener('click', function() {
        const targetView = this.getAttribute('data-target');
        commandPalette.classList.remove('open');
        
        const matchingMenu = document.querySelector(`.menu-item[data-view="${targetView}"]`);
        if (matchingMenu) matchingMenu.click();
    });
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        taskModal.classList.remove('open');
        commandPalette.classList.remove('open');
    }
});

window.addEventListener('click', (e) => {
    if (e.target === taskModal) taskModal.classList.remove('open');
    if (e.target === commandPalette) commandPalette.classList.remove('open');
});

document.querySelector('.toggle-switch').addEventListener('click', function() {
    this.classList.toggle('active');
});
updateSidebarBadges();
renderTasks();
renderRightDetailPanel();
