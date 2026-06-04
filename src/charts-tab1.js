// ── Tab 1: Integration Efficiency ──────────────────────────────────────────

function renderFunnel(containerId) {
  const card = makeChartCard('funnel-chart', 'Record Matching Results');
  document.getElementById(containerId).appendChild(card);

  const C = CONFIG.integration;
  _charts['funnel-chart'] = new Chart(document.getElementById('funnel-chart'), {
    type: 'bar',
    data: {
      labels: [
        `Auto-matched (${C.autoMatchedPct}%)`,
        `Spot-check queue (${C.spotCheckPct}%)`,
        `Manual exceptions (${C.exceptionsPct}%)`,
      ],
      datasets: [{
        data: [C.autoMatched, C.spotCheck, C.exceptions],
        backgroundColor: [
          CONFIG.palette.green,
          CONFIG.palette.yellow,
          CONFIG.palette.red,
        ],
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { callback: v => fmt(v) },
          grid: { color: CONFIG.palette.gray2 },
        },
        y: { grid: { display: false } },
      },
    },
  });
}

function renderTimeline(containerId) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `<div class="chart-title">Integration Timeline: Without vs. With P3RL</div><canvas id="timeline-chart"></canvas>`;
  document.getElementById(containerId).appendChild(card);

  const phases = CONFIG.timeline.map(p => p.phase);
  // Build cumulative start offsets for floating bars [start, end]
  let withoutCursor = 0, withCursor = 0;
  const withoutBars = [], withBars = [];
  CONFIG.timeline.forEach(p => {
    withoutBars.push([withoutCursor, withoutCursor + p.without]);
    withoutCursor += p.without;
    withBars.push([withCursor, withCursor + p.with]);
    withCursor += p.with;
  });

  _charts['timeline-chart'] = new Chart(document.getElementById('timeline-chart'), {
    type: 'bar',
    data: {
      labels: phases,
      datasets: [
        {
          label: 'Without P3RL (18 wks)',
          data: withoutBars,
          backgroundColor: CONFIG.palette.coral + 'CC',
          borderRadius: 3,
        },
        {
          label: 'With P3RL (6 wks)',
          data: withBars,
          backgroundColor: CONFIG.palette.green + 'CC',
          borderRadius: 3,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: {
          title: { display: true, text: 'Weeks' },
          ticks: { stepSize: 2 },
          grid: { color: CONFIG.palette.gray2 },
        },
        y: { grid: { display: false } },
      },
    },
  });
}

function renderExceptionDonuts(containerId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chart-card';
  wrapper.innerHTML = `
    <div class="chart-title">Exception Queue by Record Type</div>
    <div style="display:flex;gap:16px;justify-content:center;align-items:center;padding:12px 0;">
      <canvas id="donut-owners"  width="140" height="140"></canvas>
      <canvas id="donut-vendors" width="140" height="140"></canvas>
      <canvas id="donut-boards"  width="140" height="140"></canvas>
    </div>
  `;
  document.getElementById(containerId).appendChild(wrapper);

  const makeDonut = (id, label, count, total, color) => {
    _charts[id] = new Chart(document.getElementById(id), {
      type: 'doughnut',
      data: {
        labels: ['Exceptions', 'Matched'],
        datasets: [{ data: [count, total - count], backgroundColor: [color, CONFIG.palette.gray100], borderWidth: 0 }],
      },
      options: {
        responsive: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          title: { display: true, text: [`${fmt(count)}`, label], font: { size: 11 }, color: CONFIG.palette.navy },
        },
      },
    });
  };

  const ex = CONFIG.exceptionsByType;
  const C  = CONFIG.integration;
  makeDonut('donut-owners',  'Owner records',   ex.owners,       C.totalRecords, CONFIG.palette.red);
  makeDonut('donut-vendors', 'Vendor records',  ex.vendors,      C.totalRecords, CONFIG.palette.yellow);
  makeDonut('donut-boards',  'Board contacts',  ex.boardContacts,C.totalRecords, CONFIG.palette.coral);
}

function renderIntegrationTracker(containerId) {
  const card = document.createElement('div');
  card.className = 'chart-card';

  const statusLabel = { at_risk: 'At Risk', in_progress: 'In Progress', complete: 'Complete' };
  const rows = CONFIG.pipeline.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.closeDate}</td>
      <td>${fmt(p.records)}</td>
      <td>${p.matchedPct}%</td>
      <td>${p.exceptions > 0 ? fmt(p.exceptions) : '—'}</td>
      <td><span class="status-chip ${p.status}">${statusLabel[p.status]}</span></td>
      <td>${p.daysToLive !== null ? p.daysToLive + ' days' : 'Done'}</td>
    </tr>
  `).join('');

  card.innerHTML = `
    <div class="chart-title">Active Integration Pipeline</div>
    <table class="tracker-table">
      <thead>
        <tr>
          <th>Company</th><th>Close Date</th><th>Records</th>
          <th>Matched</th><th>Exceptions</th><th>Status</th><th>Days to Live</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  document.getElementById(containerId).appendChild(card);
}

function renderIntegrationTab() {
  const el = document.getElementById('tab-integration');
  el.innerHTML = '';

  // BANs
  const C = CONFIG.integration;
  el.appendChild(sectionTitle('Summit Ridge Management — Integration Status'));
  const bansEl = document.createElement('div');
  bansEl.className = 'ban-row';
  renderBAN(bansEl, 'Total records ingested',     fmt(C.totalRecords),  false, 'Summit Ridge records received');
  renderBAN(bansEl, 'Auto-matched',               fmt(C.autoMatched) + ' (' + C.autoMatchedPct + '%)', false, 'No manual review required');
  renderBAN(bansEl, 'Spot-check queue',           fmt(C.spotCheck) + ' (' + C.spotCheckPct + '%)',     false, 'Medium-confidence, human spot-check');
  renderBAN(bansEl, 'Manual exceptions',          fmt(C.exceptions) + ' (' + C.exceptionsPct + '%)',   true,  'vs. 12,847 without P3RL');
  renderBAN(bansEl, 'Weeks to CiraNet live',      C.weeksWithP3rl + ' weeks',                          true,  'vs. ' + C.weeksWithoutP3rl + ' weeks without P3RL');
  el.appendChild(bansEl);

  // Charts
  const grid = document.createElement('div');
  grid.className = 'chart-grid two-col';
  grid.id = 'tab1-grid';
  el.appendChild(grid);

  renderFunnel('tab1-grid');
  renderTimeline('tab1-grid');

  const grid2 = document.createElement('div');
  grid2.className = 'chart-grid two-col';
  grid2.id = 'tab1-grid2';
  el.appendChild(grid2);

  renderExceptionDonuts('tab1-grid2');
  renderIntegrationTracker('tab1-grid2');
}
