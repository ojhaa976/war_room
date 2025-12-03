/* -------------------------------
   FULL JS FROM YOUR ORIGINAL FILE
   (NO CHANGES MADE)
-------------------------------- */

const syllabusData = { /* your entire syllabusData object */ };

// Chart instances
let syllabusChartInstance = null;
let abcChartInstance = null;

// On load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    loadSubjectData('accounts');
    document.getElementById('date-display').innerText = new Date().toLocaleDateString();
});

/* ========== NAVIGATION ========== */
function switchTab(tabId) {
    ['dashboard', 'intel', 'daily', 'endgame'].forEach(id => {
        document.getElementById(`view-${id}`).classList.add('hidden');
        document.getElementById(`btn-${id}`).classList.remove('active');
    });

    document.getElementById(`view-${tabId}`).classList.remove('hidden');
    document.getElementById(`btn-${tabId}`).classList.add('active');
}

/* ========== DASHBOARD ========== */
function initDashboard() {
    const targetDate = new Date("2026-01-15T09:00:00").getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById("countdown-timer").innerText = days > 0 ? days : "000";
    };

    updateTimer();
    setInterval(updateTimer, 86400000);

    const ctx = document.getElementById('syllabusChart').getContext('2d');
    if(syllabusChartInstance) syllabusChartInstance.destroy();

    syllabusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Accounting', 'Business Laws', 'Quant', 'Economics'],
            datasets: [{
                data: [25, 25, 25, 25],
                backgroundColor: ['#1e293b', '#334155', '#475569', '#64748b'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/* ========== INTEL TAB ========== */
function loadSubjectData(subjectKey) {
    const data = syllabusData[subjectKey];

    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('active-subject', 'ring-2', 'ring-war-accent', 'bg-white', 'shadow');
        btn.classList.add('bg-slate-200');
    });

    const activeBtn = document.querySelector(`button[data-subject="${subjectKey}"]`);
    activeBtn.classList.remove('bg-slate-200');
    activeBtn.classList.add('bg-white','ring-2','ring-war-accent','shadow');

    document.getElementById('subject-title').innerText = data.title;
    document.getElementById('subject-content').innerHTML = data.content;

    const ctx = document.getElementById('abcChart').getContext('2d');
    if(abcChartInstance) abcChartInstance.destroy();

    abcChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: ['#dc2626', '#2563eb', '#16a34a', '#94a3b8'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 60 } }
        }
    });
}

/* ========== DAILY OPS SCHEDULE ========== */
function generateSchedule() {
    const startTimeInput = document.getElementById('start-time').value;
    const totalHours = parseInt(document.getElementById('study-hours').value);
    const container = document.getElementById('schedule-output');

    if (!startTimeInput) {
        alert("Enter Start Time, Soldier.");
        return;
    }

    let currentTime = new Date(`2000-01-01T${startTimeInput}`);
    let html = '';
    let hoursFilled = 0;
    let blockCount = 1;

    while (hoursFilled < totalHours) {
        const startStr = currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        currentTime.setMinutes(currentTime.getMinutes() + 90);
        const endStr = currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        let subject = "";
        let task = "";
        let colorClass = "";

        const rotation = blockCount % 4;
        if (rotation === 1) { subject="ACCOUNTING"; task="Practical problems."; colorClass="border-l-4 border-slate-800 bg-slate-50"; }
        else if (rotation === 2) { subject="BUSINESS LAWS"; task="Writing + Case Laws."; colorClass="border-l-4 border-slate-600 bg-white"; }
        else if (rotation === 3) { subject="QUANT"; task="Speed drills."; colorClass="border-l-4 border-slate-500 bg-slate-50"; }
        else { subject="ECONOMICS"; task="Graphs + Concepts."; colorClass="border-l-4 border-slate-400 bg-white"; }

        html += `
        <div class="flex items-start p-3 rounded shadow-sm ${colorClass}">
            <div class="w-24 font-mono font-bold text-sm text-slate-500">${startStr}</div>
            <div class="flex-1">
                <div class="font-bold text-war-dark text-sm">BLOCK ${blockCount}: ${subject}</div>
                <div class="text-xs text-slate-600">${task}</div>
            </div>
        </div>`;

        hoursFilled += 1.5;

        if (hoursFilled < totalHours) {
            currentTime.setMinutes(currentTime.getMinutes() + 15);
        }

        blockCount++;
    }

    html += `<div class="mt-4 p-3 bg-war-dark text-white rounded text-center text-sm font-bold">
        MISSION COMPLETE
    </div>`;

    container.innerHTML = html;
}
