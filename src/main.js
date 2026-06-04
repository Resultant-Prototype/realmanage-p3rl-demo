// Shared chart registry
const _charts = {};
function destroyChart(id) {
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
}

// Shared DOM helpers
function renderBAN(container, label, value, isLead = false, sub = '') {
  const card = document.createElement('div');
  card.className = 'ban-card' + (isLead ? ' lead' : '');
  card.innerHTML = `
    <div class="ban-label">${label}</div>
    <div class="ban-value">${value}</div>
    ${sub ? `<div class="ban-sub">${sub}</div>` : ''}
  `;
  container.appendChild(card);
}

function makeChartCard(id, title) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `<div class="chart-title">${title}</div><canvas id="${id}"></canvas>`;
  return card;
}

function sectionTitle(text) {
  const h = document.createElement('div');
  h.className = 'section-title';
  h.textContent = text;
  return h;
}

function banRow(cards) {
  const row = document.createElement('div');
  row.className = 'ban-row';
  cards.forEach(c => row.appendChild(c));
  return row;
}

function fmt(n)  { return n.toLocaleString(); }
function fmtDollar(n) { return '$' + (n / 1e6).toFixed(1) + 'M'; }
function fmtPct(n) { return n + '%'; }

// Tab routing
function renderTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector('.tab-btn[data-tab="' + tabId + '"]').classList.add('active');

  if (tabId === 'integration') renderIntegrationTab();
  if (tabId === 'portfolio')   renderPortfolioTab();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => renderTab(btn.dataset.tab));
  });
  renderTab('integration');
});
