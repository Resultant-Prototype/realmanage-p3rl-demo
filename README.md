# RealManage — P3RL Identity Resolution Demo (Concept)

**Status:** Idea / pre-build research  
**Originated:** Mike Hughes ask, June 2026  
**Reference demos:** `redweek-identity-demo/`, `fan-identity-demo-template/`

---

## Why This Exists

Mike Hughes asked Brian to assess whether RealManage (realmanage.com) is worth building
a P3RL identity resolution prototype for, similar to the RedWeek demo.

Short answer: the data fragmentation problem is real and structural. Worth building if
there's a warm relationship or credible buyer. Don't build cold.

---

## About RealManage

Top-3 HOA management company in the US. 950,000 homes managed, $1.1B revenue,
10 states, 54 offices. Proprietary platform: CiraNet (cloud-based, multi-portal --
board, resident, vendor, title agent portals).

**The fragmentation:** CiraNet is community-centric, not owner-centric. Each HOA community
is a separate instance. An investor with units in Austin and Dallas has two separate records.
There is no cross-community identity layer in the platform today.

---

## Fragmentation Scenarios (the use case)

| Scenario | Identity Problem |
|---|---|
| Owner with units in 3 RealManage communities | 3 separate account records, no linked view |
| Investor delinquent in one community, current in another | No cross-portfolio collections visibility |
| Contractor working across 20 communities | 20 vendor records, 1099 reconciliation problem |
| Board member serving on 2 community boards | No unified contact record |
| Same person as owner vs. resident (renting out) | Owner and resident roles split across separate records |

---

## Demo Concept: How RedWeek Maps to RealManage

| RedWeek element | RealManage equivalent |
|---|---|
| 5 resorts | 54 communities across 10 states |
| Owner / Renter / Resale personas | Owner / Investor / Delinquent / Board member |
| Traveler ID Rate KPI | Linked Owner Rate |
| Venn: persona overlap across resorts | Venn: homeowners shared across communities |
| Sankey: renter to resale conversion | Sankey: renter to owner to multi-property investor |
| Geographic distribution | State-level heat map (10 states is a natural visual) |

Additional panels to add vs. RedWeek:
- **Collections risk view:** % of delinquent owners who also hold current accounts in other communities -- the cross-portfolio collections argument
- **Vendor consolidation panel:** estimated 1099s collapsed by linking vendor records across communities

---

## Build Effort

Low. Same JS stack as RedWeek (Chart.js, D3, Venn, Sankey). Simulated data only --
no real client data needed. Estimate 60-80% reuse from redweek-identity-demo.

Scale to simulate: 950K homes, 54 communities, 10 states.

---

## Before Building: Validate First

- Is RealManage in active pipeline or cold? A built demo on a cold door is expensive.
- Who owns data/analytics at RealManage? (VP Technology, CTO, CDO -- look on LinkedIn)
- CiraNet is proprietary -- they may have identity consolidation on their own roadmap already.
- P3RL's "no UI" limitation matters more in HOA ops (staff need to act daily) than in sports. Worth flagging.

If the door is warm, build it. If cold, use the RedWeek demo as a concept-transfer piece
and build only after a first conversation confirms interest.

---

## Vertical Reuse

HOA management is fragmented -- Associa, FirstService Residential, CINC, PPM are
comparable players. One demo built for this vertical serves all of them. If RealManage
conversation advances, this becomes a vertical asset not just a one-off.
