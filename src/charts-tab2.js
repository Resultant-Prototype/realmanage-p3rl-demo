// ── Tab 2: Portfolio Intelligence ──────────────────────────────────────────

function renderOwnerSegmentBar(containerId) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `
    <div class="chart-title">Owner Identity Segments</div>
    <canvas id="owner-segment-chart" style="max-height:160px;"></canvas>
    <div class="chart-callout" style="margin-top:14px;">
      <strong>318</strong> multi-community investors are delinquent across communities —
      invisible to CiraNet without P3RL identity resolution.
    </div>
  `;
  document.getElementById(containerId).appendChild(card);

  const V = CONFIG.venn;
  const P = CONFIG.palette;
  const totals = [V.aOnly + V.aPlusC, V.bOnly + V.bPlusC];

  _charts['owner-segment-chart'] = new Chart(document.getElementById('owner-segment-chart'), {
    type: 'bar',
    data: {
      labels: ['Single-community', 'Multi-community'],
      datasets: [
        {
          label: 'Current',
          data: [V.aOnly, V.bOnly],
          backgroundColor: P.teal + 'AA',
          borderColor: P.teal,
          borderWidth: 1,
        },
        {
          label: 'Delinquent',
          data: [V.aPlusC, V.bPlusC],
          backgroundColor: [P.coral + 'BB', P.red + 'EE'],
          borderColor: [P.coral, P.red],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = Math.round(ctx.raw / totals[ctx.dataIndex] * 100);
              const base = ctx.dataset.label + ': ' + fmt(ctx.raw) + ' (' + pct + '%)';
              if (ctx.datasetIndex === 1 && ctx.dataIndex === 1) {
                return [base, 'Cross-portfolio risk — invisible without P3RL'];
              }
              return base;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { color: P.gray2 + '44' },
          ticks: { callback: v => fmt(v), font: { size: 11 } },
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { size: 12 } },
        },
      },
    },
  });
}

function renderPortfolioSankey(containerId) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `<div class="chart-title">Owner Journey: Role to Payment Status</div><div id="sankey-div" style="width:100%;height:260px;"></div>`;
  document.getElementById(containerId).appendChild(card);

  const { leftNodes, rightNodes, flows } = CONFIG.sankey;
  const allNodes = [...leftNodes, ...rightNodes].map((n, i) => ({ ...n, index: i }));
  const nodeMap  = Object.fromEntries(allNodes.map(n => [n.id, n]));

  const sankeyLinks = flows.map(([src, tgt, val]) => ({
    source: nodeMap[src].index,
    target: nodeMap[tgt].index,
    value:  val,
  }));

  const div    = document.getElementById('sankey-div');
  const width  = div.clientWidth || 480;
  const height = 260;
  const svg    = d3.select(div).append('svg').attr('width', width).attr('height', height);

  const sankeyLayout = d3.sankey()
    .nodeId(d => d.index)
    .nodeWidth(16)
    .nodePadding(12)
    .extent([[1, 1], [width - 1, height - 6]]);

  const graph = sankeyLayout({ nodes: allNodes.map(d => ({ ...d })), links: sankeyLinks });

  const colors = [CONFIG.palette.blue, CONFIG.palette.slate,
                  CONFIG.palette.green, CONFIG.palette.yellow, CONFIG.palette.coral, CONFIG.palette.red];

  svg.append('g').selectAll('rect')
    .data(graph.nodes)
    .join('rect')
    .attr('x', d => d.x0).attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0).attr('height', d => d.y1 - d.y0)
    .attr('fill', (d, i) => colors[i % colors.length])
    .append('title').text(d => `${d.label}: ${fmt(d.count)}`);

  svg.append('g').attr('fill', 'none')
    .selectAll('path')
    .data(graph.links)
    .join('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke', (d, i) => colors[d.source.index % colors.length])
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('opacity', 0.45)
    .append('title').text(d => `${d.source.label} → ${d.target.label}: ${fmt(d.value)}`);

  svg.append('g').style('font-size', '11px')
    .selectAll('text')
    .data(graph.nodes)
    .join('text')
    .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    .text(d => d.label)
    .attr('fill', CONFIG.palette.navy);
}

function renderHeatMap(containerId, layer) {
  // layer: 'raw' | 'linked'
  const existing = document.getElementById('heatmap-card');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.className = 'chart-card';
  card.id = 'heatmap-card';
  card.innerHTML = `
    <div class="chart-header">
      <div class="chart-title">Owner Distribution by State</div>
      <div class="seg-control" id="heatmap-toggle">
        <button data-layer="raw"    class="${layer === 'raw'    ? 'active' : ''}">Raw Records</button>
        <button data-layer="linked" class="${layer === 'linked' ? 'active' : ''}">Linked Entities</button>
      </div>
    </div>
    <div id="heatmap-div" style="width:100%;height:220px;position:relative;"></div>
  `;
  document.getElementById(containerId).appendChild(card);

  // Attach toggle listeners
  card.querySelectorAll('#heatmap-toggle button').forEach(btn => {
    btn.addEventListener('click', () => renderHeatMap(containerId, btn.dataset.layer));
  });

  // Data for each layer
  const stateData = {};
  CONFIG.states.forEach(s => {
    stateData[s] = {
      raw:    CONFIG.stateRawRecords[s] || 0,
      linked: CONFIG.stateLinkedRate[s] || 0,
      rawVendor: CONFIG.vendorRaw[s] || 0,
    };
  });

  const getValue = s => layer === 'raw'
    ? stateData[s].raw
    : Math.round(stateData[s].linked * (CONFIG.stateRawRecords[s] || 0));

  const values = CONFIG.states.map(getValue).filter(v => v > 0);
  const maxVal = Math.max(...values, 1);
  const colorScale = d3.scaleSequential([0, maxVal], d3.interpolateBlues);

  const div    = document.getElementById('heatmap-div');
  const width  = div.clientWidth || 440;
  const height = 220;
  const proj   = d3.geoAlbersUsa().fitSize([width, height], { type: 'Sphere' });
  const path   = d3.geoPath().projection(proj);
  const svg    = d3.select(div).append('svg').attr('width', width).attr('height', height);

  fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    .then(r => r.json())
    .then(us => {
      const fipsMap = CONFIG.stateFips;
      const invFips = Object.fromEntries(Object.entries(fipsMap).map(([k, v]) => [v, k]));

      svg.append('g').selectAll('path')
        .data(topojson.feature(us, us.objects.states).features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => {
          const abbr = invFips[String(d.id).padStart(2, '0')];
          if (!abbr || !CONFIG.states.includes(abbr)) return '#e8edf4';
          const v = getValue(abbr);
          return v === 0 ? '#d4d8df' : colorScale(v);
        })
        .attr('stroke', '#fff').attr('stroke-width', 0.5)
        .append('title').text(d => {
          const abbr = invFips[String(d.id).padStart(2, '0')];
          if (!abbr || !CONFIG.states.includes(abbr)) return '';
          const raw = CONFIG.stateRawRecords[abbr] || 0;
          if (raw === 0) return `${abbr}: No data`;
          const linkedRate = fmtPct(Math.round(CONFIG.stateLinkedRate[abbr] * 100));
          return `${abbr}: ${fmt(raw)} records | Linked rate: ${linkedRate}`;
        });
    });
}

function renderVendorConsolidation(containerId) {
  const card = makeChartCard('vendor-chart', 'Vendor Deduplication by State');
  document.getElementById(containerId).appendChild(card);

  const states = CONFIG.states.filter(s => CONFIG.vendorRaw[s] > 0);
  _charts['vendor-chart'] = new Chart(document.getElementById('vendor-chart'), {
    type: 'bar',
    data: {
      labels: states,
      datasets: [
        {
          label: 'Raw vendor records',
          data: states.map(s => CONFIG.vendorRaw[s]),
          backgroundColor: CONFIG.palette.coral + 'BB',
          borderRadius: 3,
        },
        {
          label: 'Unique entities (after P3RL)',
          data: states.map(s => CONFIG.vendorLinked[s]),
          backgroundColor: CONFIG.palette.green + 'BB',
          borderRadius: 3,
        },
      ],
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { grid: { display: false } },
        y: { ticks: { callback: v => fmt(v) }, grid: { color: CONFIG.palette.gray2 } },
      },
    },
  });

  const callout = document.createElement('div');
  callout.className = 'chart-callout';
  callout.textContent = fmt(CONFIG.portfolio.duplicateEins) + ' duplicate EINs removed — 1099 errors prevented';
  card.appendChild(callout);
}

function renderCollectionsTable(containerId) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  const rows = CONFIG.collectionsRisk.map(r => `
    <tr>
      <td>${r.displayId}</td>
      <td style="text-align:center;">${r.active}</td>
      <td style="text-align:center;">${r.flagged}</td>
      <td class="balance">$${r.balance.toLocaleString()}</td>
      <td>${r.worstStatus}</td>
    </tr>
  `).join('');

  card.innerHTML = `
    <div class="chart-title">Cross-Portfolio Collections Risk (Top 25)</div>
    <table class="risk-table">
      <thead>
        <tr>
          <th>Entity ID</th>
          <th style="text-align:center;">Active Communities</th>
          <th style="text-align:center;">Flagged Communities</th>
          <th>Total Balance Due</th>
          <th>Worst Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="chart-callout">
      This view does not exist in CiraNet today. Each of these entities appears as separate,
      unlinked accounts across multiple communities.
    </div>
  `;
  document.getElementById(containerId).appendChild(card);
}

function renderPortfolioTab() {
  const el = document.getElementById('tab-portfolio');
  el.innerHTML = '';

  // BANs
  const P = CONFIG.portfolio;
  el.appendChild(sectionTitle('RealManage Portfolio — Post-Integration Entity Graph'));
  const bansEl = document.createElement('div');
  bansEl.className = 'ban-row';
  renderBAN(bansEl, 'Linked owner rate',               fmtPct(P.linkedOwnerRate),        false, 'Owner records matched across 2+ communities');
  renderBAN(bansEl, 'Multi-community investors',        fmt(P.multiCommunityCount),        false, 'Unique owners in 2+ communities');
  renderBAN(bansEl, 'Vendor records before linking',   fmt(P.vendorRawTotal),             false, 'Raw vendor records across full portfolio');
  renderBAN(bansEl, 'Unique vendor entities',          fmt(P.vendorLinkedTotal),          false, 'After P3RL deduplication (' + P.vendorReductionPct + '% reduction)');
  renderBAN(bansEl, 'Duplicate 1099s prevented',       fmt(P.duplicateEins),              false, 'EIN duplicates eliminated');
  renderBAN(bansEl, 'Cross-portfolio delinquency',     fmt(P.crossPortfolioSignals),      false, 'Owners delinquent in one community, active in others');
  renderBAN(bansEl, 'Collections exposure identified', fmtDollar(P.collectionsExposure),  true,  'Total balance across 318 cross-portfolio risk entities');
  el.appendChild(bansEl);

  // Row 1: Venn + Sankey
  const grid1 = document.createElement('div');
  grid1.className = 'chart-grid two-col';
  grid1.id = 'tab2-grid1';
  el.appendChild(grid1);
  renderOwnerSegmentBar('tab2-grid1');
  renderPortfolioSankey('tab2-grid1');

  // Row 2: Heat map (full width)
  const grid2 = document.createElement('div');
  grid2.className = 'chart-grid full';
  grid2.id = 'tab2-grid2';
  el.appendChild(grid2);
  renderHeatMap('tab2-grid2', 'raw');

  // Row 3: Vendor bar + Collections table
  const grid3 = document.createElement('div');
  grid3.className = 'chart-grid two-col';
  grid3.id = 'tab2-grid3';
  el.appendChild(grid3);
  renderVendorConsolidation('tab2-grid3');
  renderCollectionsTable('tab2-grid3');
}
