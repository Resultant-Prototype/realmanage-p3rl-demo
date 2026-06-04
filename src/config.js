const CONFIG = {
  org: {
    name: 'RealManage',
    tagline: 'HOA Community Management',
    acquisition: 'Summit Ridge Management',
  },

  states: ['TX', 'AZ', 'FL', 'CA', 'CO', 'NC', 'GA', 'NV', 'WA', 'IL'],

  // State FIPS codes needed for D3 choropleth (same approach as RedWeek)
  stateFips: {
    TX: '48', AZ: '04', FL: '12', CA: '06', CO: '08',
    NC: '37', GA: '13', NV: '32', WA: '53', IL: '17',
  },

  // Summit Ridge contributes 8 communities: TX(4), AZ(2), FL(1), CO(1)
  summitRidgeStates: { TX: 4, AZ: 2, FL: 1, CO: 1 },

  // Raw record density by state (owner records, approximate)
  // Drives heat map Layer 1. TX and AZ darkest.
  stateRawRecords: {
    TX: 11200, AZ: 6800, FL: 4200, CA: 3100, CO: 1400,
    NC: 1200, GA:  900, NV:  600, WA:  400, IL: 0,
  },

  // Linked entity density by state (multi-community entities / total entities)
  // Drives heat map Layer 2. CO and WA heavier proportionally.
  stateLinkedRate: {
    TX: 0.28, AZ: 0.31, FL: 0.19, CA: 0.17, CO: 0.34,
    NC: 0.15, GA: 0.14, NV: 0.22, WA: 0.37, IL: 0,
  },

  // Vendor records before and after P3RL, by state
  vendorRaw: {
    TX: 3200, AZ: 2100, FL: 1400, CA: 1000, CO:  600,
    NC:  500, GA:  400, NV:  280, WA:  160, IL: 0,
  },
  vendorLinked: {
    TX: 1020, AZ:  670, FL:  510, CA:  390, CO:  240,
    NC:  200, GA:  155, NV:  110, WA:   62, IL: 0,
  },

  // Tab 1 BANs
  integration: {
    totalRecords:      12847,
    autoMatched:        8923,
    autoMatchedPct:       69,
    spotCheck:          2441,
    spotCheckPct:         19,
    exceptions:         1483,
    exceptionsPct:        12,
    weeksWithP3rl:         6,
    weeksWithoutP3rl:     18,
  },

  // Tab 1: exception breakdown by record type
  exceptionsByType: {
    owners:       1103,
    vendors:       281,
    boardContacts: 103,
  },

  // Tab 1: Gantt phases (weeks)
  timeline: [
    { phase: 'Data extraction',         without: 2,  with: 2 },
    { phase: 'Record matching',         without: 10, with: 2 },
    { phase: 'Validation & exceptions', without: 4,  with: 1 },
    { phase: 'CiraNet go-live prep',    without: 2,  with: 1 },
  ],

  // Tab 1: integration pipeline (3 hardcoded acquisitions)
  pipeline: [
    {
      name:       'Blue Ridge Realty Group',
      closeDate:  '2026-05-20',
      records:    8332,
      matchedPct: 61,
      exceptions: 3249,
      status:     'at_risk',
      daysToLive: 42,
    },
    {
      name:       'Summit Ridge Management',
      closeDate:  '2026-04-15',
      records:    12847,
      matchedPct: 88,
      exceptions: 1483,
      status:     'in_progress',
      daysToLive: 14,
    },
    {
      name:       'Coastal HOA Partners',
      closeDate:  '2026-02-28',
      records:    4210,
      matchedPct: 94,
      exceptions: 0,
      status:     'complete',
      daysToLive: null,
    },
  ],

  // Tab 2 BANs
  portfolio: {
    linkedOwnerRate:        23,
    multiCommunityCount:  4180,
    vendorRawTotal:       11040,
    vendorLinkedTotal:     3107,
    vendorReductionPct:      67,
    duplicateEins:          412,
    crossPortfolioSignals:  318,
    collectionsExposure:  1900000,
  },

  // Tab 2: Venn segment counts (sum = 18,000 linked owner entities)
  venn: {
    aOnly:  10178,   // single-community, current
    bOnly:   3862,   // multi-community, current
    aPlusC:  3642,   // single-community, delinquent (A+C)
    bPlusC:    318,  // multi-community, delinquent (THE insight)
  },

  // Tab 2: Sankey nodes and flows
  sankey: {
    leftNodes: [
      { id: 'single', label: 'Single-community owner', count: 13820 },
      { id: 'multi',  label: 'Multi-community investor', count: 4180 },
    ],
    rightNodes: [
      { id: 'current',   label: 'Current',           count: 14076 },
      { id: 'del30',     label: 'Delinquent 30-60',  count:  1920 },
      { id: 'del60',     label: 'Delinquent 60-90',  count:  1278 },
      { id: 'collect',   label: 'Collections',       count:   726 },
    ],
    // [sourceId, targetId, value]
    flows: [
      ['single', 'current',  11747],
      ['single', 'del30',     1106],
      ['single', 'del60',      553],
      ['single', 'collect',    414],
      ['multi',  'current',   3010],
      ['multi',  'del30',      501],
      ['multi',  'del60',      376],
      ['multi',  'collect',    293],
    ],
  },

  // Tab 2: Collections risk table (top 25 rows)
  collectionsRisk: [
    { displayId:'Entity #0047', active:3, flagged:2, balance:18200, worstStatus:'Collections'       },
    { displayId:'Entity #0112', active:2, flagged:2, balance:15400, worstStatus:'Collections'       },
    { displayId:'Entity #0033', active:4, flagged:1, balance:14100, worstStatus:'Collections'       },
    { displayId:'Entity #0289', active:2, flagged:1, balance:12700, worstStatus:'Collections'       },
    { displayId:'Entity #0076', active:3, flagged:2, balance:11500, worstStatus:'Collections'       },
    { displayId:'Entity #0441', active:2, flagged:1, balance:10200, worstStatus:'Delinquent 90+'    },
    { displayId:'Entity #0198', active:3, flagged:2, balance: 9800, worstStatus:'Collections'       },
    { displayId:'Entity #0055', active:2, flagged:1, balance: 8600, worstStatus:'Collections'       },
    { displayId:'Entity #0322', active:2, flagged:2, balance: 7900, worstStatus:'Delinquent 90+'    },
    { displayId:'Entity #0011', active:3, flagged:1, balance: 7100, worstStatus:'Collections'       },
    { displayId:'Entity #0167', active:2, flagged:1, balance: 6400, worstStatus:'Delinquent 90+'    },
    { displayId:'Entity #0509', active:2, flagged:1, balance: 5800, worstStatus:'Collections'       },
    { displayId:'Entity #0234', active:2, flagged:1, balance: 5200, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0388', active:3, flagged:1, balance: 4700, worstStatus:'Collections'       },
    { displayId:'Entity #0093', active:2, flagged:1, balance: 4200, worstStatus:'Delinquent 90+'    },
    { displayId:'Entity #0601', active:2, flagged:1, balance: 3800, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0147', active:2, flagged:1, balance: 3400, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0455', active:2, flagged:1, balance: 3100, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0278', active:2, flagged:1, balance: 2800, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0512', active:2, flagged:1, balance: 2500, worstStatus:'Delinquent 30-60'  },
    { displayId:'Entity #0339', active:2, flagged:1, balance: 2200, worstStatus:'Delinquent 30-60'  },
    { displayId:'Entity #0066', active:2, flagged:1, balance: 1900, worstStatus:'Delinquent 60-90'  },
    { displayId:'Entity #0413', active:2, flagged:1, balance: 1600, worstStatus:'Delinquent 30-60'  },
    { displayId:'Entity #0188', active:2, flagged:1, balance: 1300, worstStatus:'Delinquent 30-60'  },
    { displayId:'Entity #0726', active:2, flagged:1, balance:  980, worstStatus:'Delinquent 30-60'  },
  ],

  palette: {
    navy:    '#1B2A4A',
    blue:    '#2E618F',
    slate:   '#5B7FA6',
    teal:    '#972417',
    coral:   '#D85F52',
    green:   '#2D7D46',
    yellow:  '#B07B10',
    red:     '#C0392B',
    gray:    '#8B96A5',
    gray2:   '#C5CBD4',
    gray50:  '#F8F9FA',
    gray100: '#EEF0F3',
    gray200: '#D4D8DF',
  },
};
