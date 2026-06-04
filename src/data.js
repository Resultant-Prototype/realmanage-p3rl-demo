// All primary data constants live in config.js.
// This file holds derived aggregates computed once at load time.

// Total collections exposure (sum of collectionsRisk balances)
const TOTAL_COLLECTIONS_EXPOSURE = CONFIG.collectionsRisk
  .reduce((sum, r) => sum + r.balance, 0);

// Sankey: verify right-node totals match left-node totals (debug only)
// Left total: 13820 + 4180 = 18000
// Right total: 14076 + 1920 + 1278 + 726 = 18000 (authoritative)
const SANKEY_TOTAL = CONFIG.sankey.rightNodes.reduce((s, n) => s + n.count, 0);
if (SANKEY_TOTAL !== 18000) {
  console.warn('Sankey right-node total mismatch:', SANKEY_TOTAL);
}

// Venn: verify segment totals
const VENN_TOTAL = CONFIG.venn.aOnly + CONFIG.venn.bOnly + CONFIG.venn.aPlusC + CONFIG.venn.bPlusC;
if (VENN_TOTAL !== 18000) {
  console.warn('Venn segment total mismatch:', VENN_TOTAL);
}
