# RouteOps Cloud V4 — Core Workspace

A standalone, front-end-only, high-fidelity clickable prototype of **RouteOps Cloud**, a
strategic route-planning workspace for **Community Coffee**. Built for review, hosting, and
client walkthroughs, and as a reference for later recreation in Figma.

RouteOps Cloud replaces a legacy RoadNet-style desktop workflow. A Routing Analyst uses it to
create planning sessions, preserve an immutable baseline, create editable options, manage
customer rows, assign route/day/week values, validate business rules, use map/lasso for spatial
planning, run route balancing, review changes, finalize an option, and export route data.

**This is not** live truck tracking, a driver app, or a dispatch app. Everything here happens
*before* routes go live.

---

## Contents

1. [Install, run, build](#1-install-run-build)
2. [Screen inventory](#2-screen-inventory)
3. [Sample data](#3-sample-data)
4. [Design system](#4-design-system)
5. [Row model (Option A vs Option B)](#5-row-model-option-a-vs-option-b)
6. [How to review the notable states](#6-how-to-review-the-notable-states)
7. [Assumptions and decisions](#7-assumptions-and-decisions)
8. [Known gaps](#8-known-gaps)
9. [Project structure](#9-project-structure)
10. [Verification](#10-verification)

---

## 1. Install, run, build

Requires **Node 18+** (developed and verified on Node 22).

```bash
cd routeops-cloud-v4-prototype

npm install        # install dependencies
npm run dev        # dev server  -> http://0.0.0.0:8080   (Alloy preview port)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build -> http://0.0.0.0:8080
npm run typecheck  # TypeScript only, no emit
```

The production build is verified working:

```
dist/index.html                   0.85 kB │ gzip:  0.46 kB
dist/assets/index-*.css          44.0  kB │ gzip:  8.7  kB
dist/assets/index-*.js          368    kB │ gzip: 97.9  kB
```

### Preview port

Both the dev server and the preview server bind **`0.0.0.0:8080`**, because that
is the port the Alloy preview viewer looks for. `strictPort: true` is set so the
server fails loudly instead of silently drifting to another port — if 8080 is
taken, free it rather than letting Vite pick 8081, or the viewer will sit on
"Setting up environment...".

```bash
npm run dev            # -> http://localhost:8080
```

### Sharing the build

`vite.config.ts` sets `base: './'`, so `dist/` is fully portable. You can drop it on any static
host (Netlify, S3, GitHub Pages, an internal share) or open it from a subdirectory. Routing is
hash-based (`#/workspace`), so **no server rewrite rules are needed**.

To serve `dist/` without Vite:

```bash
npx serve dist        # or: python3 -m http.server -d dist 8000
```

### Stack

- Vite 5 + React 18 + TypeScript (strict)
- Plain hand-written CSS (`src/styles/tokens.css` + `src/styles/global.css`)
- **No UI kit** — no Bootstrap, Material UI, shadcn, Chakra, Tailwind
- **No icon library** — all icons are hand-rolled inline SVG in `src/components/icons.tsx`
- **No backend** — all state is client-side React state over mock data
- Runtime dependencies: `react`, `react-dom`. That's it.

The existing `FYP_v2.0` Python scraper application at the repository root is **untouched**. This
directory is self-contained and shares nothing with it.

> **Note on `.gitignore`:** the repository root ignores `*.json`, which would silently drop
> `package.json` and `tsconfig*.json`. This directory therefore carries its own `.gitignore`
> that re-includes JSON for this subtree while still ignoring `node_modules/` and `dist/`.

---

## 2. Screen inventory

17 routes, all reachable from the dark sidebar. Routing is hash-based.

### Navigator

| Route | Screen | Purpose |
|-------|--------|---------|
| `#/screens` | **All Screens & States** | The internal navigator. 39 clickable entry points covering every screen plus 16 deep links that open drawer and validation states directly. |

### Workspace (product screens)

| # | Route | Screen | Purpose |
|---|-------|--------|---------|
| 1 | `#/dashboard` | Dashboard | Snapshot + entry points. 4 stat cards, active session card, recent uploads, recent activity. |
| 2 | `#/ingestion` | Data Ingestion | File intake queue and staging. Upload → confirm columns → validate → review → import. |
| 3 | `#/master-dataset` | Master Dataset | Active source of truth. Recent datasets table, empty state, Upload Dataset modal. |
| 4 | `#/sessions` | Sessions | **Landing screen for Sessions.** Summary cards, filters, status chips, sessions table, empty state. |
| 5 | `#/create-session` | Create Session | Form with tagged defaults, process strip, live Baseline Preview. |
| 6 | `#/workspace` | **Route Workspace** | **The core screen.** Session strip, toolbar, option rail, 7 tabs, drawers. |
| 6a | `#/map` | **Map / Lasso View** | Second lens on the workspace: view modes, tools, spatial selection, pre-move validation. |
| 6b | `#/finalize` | **Finalize Option** | Finalization checklist with clean and warning states. |
| 7 | `#/customer-master` | Customer Master | Global, session-independent customer database. Read-only for the analyst. |
| 8 | `#/master-import` | Enhancement Import | Column confirmation safety screen → import error report → apply. |
| 9 | `#/reference-data` | Reference Data | Service patterns, week pairs, routes/drivers, depots, scenarios, helper rule. |
| 10 | `#/activity` | Activity Feed | Cross-session audit trail with undo on recent writes. |
| 11 | `#/exports` | Exports | Export guard + export history. |
| 12 | `#/stop-list` | Stop List Export | Final deliverable preview + column contract. |
| 13 | `#/admin` | Admin | Roles/permissions matrix, session defaults, validation policy. |

### Design & Decisions (not production screens)

These are clearly badged *"Design decision · not a production screen"* so they never read as
shippable product surfaces.

| # | Route | Screen | Purpose |
|---|-------|--------|---------|
| 13a | `#/validation-system` | Validation Message System | Part Q. Every validation surface, the five global rules, and the exact copy. |
| 14 | `#/foundation` | Design Foundation | Part A. Every primitive, live. Colour, type, buttons, inputs, badges, banners, toasts, tooltip, drawer, modal, empty, progress. |
| 15 | `#/row-model` | Row Model Decision | Part F. Option A vs Option B side by side, with the duplicate-row mitigation. |
| 16 | `#/open-decisions` | Open Decisions | 9 questions that change the build, each with options, consequences, owner and recommendation. |
| 17 | `#/checklist` | Alignment Checklist | Every brief requirement mapped to what exists, including honest gaps. |

### Deep links

Drawer and validation states are addressable, which is what powers the
navigator. Useful ones:

| Link | Opens |
|---|---|
| `#/workspace` | Customers grid, Option B, default tab |
| `#/workspace?tab=metrics` | Metrics tab (any of the seven tab ids) |
| `#/workspace?version=baseline` | Immutable baseline, all writes disabled |
| `#/workspace?drawer=assign&day=Tue&week=3` | Bulk assign **success** path |
| `#/workspace?drawer=assign&day=Fri&week=3` | Bulk assign **failure** path |
| `#/workspace?drawer=customer&id=1000108` | Customer drawer, Not in Master |
| `#/workspace?drawer=customer&id=1000214` | Customer drawer, Route Mismatch |
| `#/workspace?drawer=route&id=970` | Route drawer, over target + sequencer |
| `#/workspace?drawer=map` | Map / lasso spatial planning |
| `#/workspace?drawer=finalize` | Finalization warnings (modal variant) |
| `#/workspace?drawer=cycle` | Cycle length change edge case (Part K) |
| `#/workspace?drawer=reassign&dest=971` | Reassign: all valid |
| `#/workspace?drawer=reassign&dest=972` | Reassign: some blocked |
| `#/workspace?drawer=reassign&dest=973` | Reassign: all blocked, no proceed button |
| `#/workspace?drawer=route&id=970` | Helper allowed (presale) |
| `#/workspace?drawer=route&id=971` | Helper blocked (conventional) |
| `#/map` | Map / Lasso View |
| `#/map?version=baseline` | Read-only baseline map, lasso disabled |
| `#/ingestion?action=reconcile` | Permanent action, type-to-confirm |

A bare `#/workspace` link always resets to the default tab and the editable
option, so following two links in a row never leaves stale state behind.

### Route Workspace tabs

`Customers` (default) · `Routes` · `Territories` · `Day / Week Heat` · `Metrics` · `Compare` ·
`Activity`

### Drawers and modals

| Surface | Opened from | Covers |
|---|---|---|
| Assign Day / Week drawer | Toolbar (needs a selection) | Parts I + J: day/week pickers, week pairs, 4-week variant, validation success, progress, failure |
| Reassign Route drawer | Toolbar (needs a selection) | Bulk route move with projected target impact |
| Customer Detail drawer | Row `Open` or child row click | Part K: zones A/B/C, single Save, validation failure, unsaved guard, Not-in-Master, Route Mismatch |
| Route Detail drawer | Routes tab row | Parts L + M: metrics, scenario, helper rule, sequencer states |
| Spatial Planning Map | Toolbar `Open Map` | Map/lasso selection + lasso validation |
| Finalize modal | Toolbar `Finalize` | Finalization warnings: blockers, warnings, passing checks, acknowledgement |
| Export guard modal | Exports screen | Blocks export until finalized and blocker-free |
| Upload Dataset modal | Master Dataset | Drop zone, format helper, upload progress |
| Import confirm modal | Enhancement Import | Destructive-overwrite confirmation |
| Unsaved changes guard | Customer drawer with edits | Keep Editing / Discard Changes |

---

## 3. Sample data

All sample data lives in one documented file: **`src/data/mock.ts`**. There is no backend and no
network call anywhere. Figures are deterministic (a seeded LCG drives any filler values), so
screenshots are reproducible across runs.

### Session (fixed by the brief)

| Field | Value |
|---|---|
| Session name | Delivery Scenario as of 07/23/2026, 4:42 PM |
| Market | Baton Rouge |
| Status | Draft |
| Scenario | Delivery |
| Cycle | 8 Week (week pairs 1+5, 2+6, 3+7, 4+8) |
| Starting week | Wk 1 |
| Depot | BR North |
| Time period | July 2026 |
| Routes / Territories | 970, 971, 972, 973, 974, 975, 976, 977 (8) |
| Customers | 1,300 |
| Revenue | $830,809 |
| Baseline | Immutable |
| Active option | Option 1 |
| Planning rows (Option B) | ~6,500 |
| User | Michael Reeves · Routing Analyst · Community Coffee |

### Customers

**26 representative customers** are rendered in the grid; counts and bulk-action copy are shown
at the real **1,300-customer session scale**. The three customers named in the brief use its
exact values:

| Customer | Master | Route | Days | Week | Pattern | Frequency | Revenue | Preferred | Mismatch | Address | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1000004 | In Master | 970 | Mon–Fri | Wk 1, Wk 5 | E4W | Weekly | $372.36 | 970 | Match | Available | Valid |
| 1000108 | Not in Master | 971 | Tue | Wk 3 | 4T | Every 4 weeks | $210.84 | — | — | Unavailable | Warning |
| 1000214 | In Master | 972 | Wed | Wk 2 | 2W | Twice Weekly | $480.20 | 970 | Mismatch | Available | Warning |

The remaining 23 are realistic Baton Rouge coffee-service accounts (cafés, C-stores, hotels,
institutional) that exercise every badge and validation path, including a **Blocked** row
(1000812, missing service pattern) and further **Not in Master** / **Mismatch** rows.

### Routes

Driver, customer count, service/travel time, total hours, revenue, helper, scenario, status.
Internally consistent: totals sum to **1,300 customers** and **$830,809**; exactly **2 routes are
over the 8h target (970, 977)** and **2 are underused (972, 976)**, matching the Routes footer,
the Metrics cards and the finalization checks.

| Route | Driver | Customers | Service | Travel | Total | Revenue | Helper | Scenario | Status |
|---|---|---|---|---|---|---|---|---|---|
| 970 | M. Daniels | 180 | 310 min | 245 min | 9h 15m | $112,840 | Assigned | Presale | Over Target |
| 971 | R. Carter | 160 | 260 min | 208 min | 7h 48m | $95,520 | None | Conventional | Balanced |
| 972 | A. Lewis | 142 | 190 min | 182 min | 6h 12m | $84,420 | None | Delivery | Underused |
| 973 | T. Boudreaux | 172 | 252 min | 213 min | 7h 45m | $108,940 | None | Delivery | Balanced |
| 974 | J. Ellison | 158 | 254 min | 219 min | 7h 53m | $101,220 | Assigned | Presale | Balanced |
| 975 | D. Fontenot | 166 | 256 min | 218 min | 7h 54m | $106,480 | None | Delivery | Balanced |
| 976 | K. Sonnier | 148 | 205 min | 191 min | 6h 36m | $96,330 | None | Conventional | Underused |
| 977 | L. Guidry | 174 | 302 min | 252 min | 9h 14m | $125,059 | Assigned | Presale | Over Target |

### Service patterns (drive real validation)

`SERVICE_PATTERNS` is a real rule table, not decoration. `validateAssignment(pattern, day, week)`
is shared by the customer drawer, the bulk assign flow and the map lasso.

| Code | Name | Frequency | Allowed days | Allowed weeks |
|---|---|---|---|---|
| E4W | Established 4-week | Weekly | Mon–Fri | 1–8 |
| 4T | Every fourth week | Every 4 weeks | Mon–Fri | 1, 3, 5, 7 |
| 2W | Twice weekly | Twice Weekly | Mon–Fri | 1–8 |
| 2T | Twice weekly, early week | Twice Weekly | Mon, Tue, Wed | 1–8 |
| 1W | Weekly | Weekly | Mon–Sat | 1–8 |
| EOW | Every other week | Every 2 Weeks | Mon–Fri | 1, 3, 5, 7 |
| 8T | Every eighth week | Every 8 weeks | Tue, Wed, Thu | 1–8 |
| 3W | Three times weekly | Three Times Weekly | Mon–Fri | 1–8 |

`8T` and `2T` never service Friday, which is what makes the two bulk-assign demo paths follow
from the rules rather than from a toggle:

| Assignment | Result |
|---|---|
| **Tuesday, Week 3** | Every pattern in the selection permits it → **all 1,300 pass** |
| **Friday, Week 3** | `8T` (9 customers) and `2T` (5) forbid Friday → **14 fail, nothing saves** |

`validateScope(day, week)` in `mock.ts` runs the real engine across the documented
`SCOPE_POPULATION` mix, so those counts are computed, not asserted.

### Other datasets

| Export | Contents |
|---|---|
| `SESSIONS` | 3 sessions (Baton Rouge Draft, Baton Rouge Baseline Review, Lafayette Finalized) |
| `DATASETS` | 4 datasets (Active, Imported, 2 Archived) |
| `ACTIVITY` | 8 audit events across Option 1 / Session / Master Dataset scopes |
| `VIOLATIONS` | 5 shown of 14 total bulk-assign violations |
| `COLUMN_MAPPINGS` | 8 source columns, 2 flagged destructive |
| `IMPORT_ERRORS` | 7 rows (5 Blocked, 2 Warning) |
| `FINALIZE_CHECKS` | 2 blockers (9 rows), 3 warnings (94 rows), 2 passing |
| `EXPORTS` | 3 exports (1 Blocked, 2 Exported) |
| `MAP_PINS` | 260 pins clustered by route; each stands for ~5 customers |
| `buildStopList()` | Stop rows derived from planning rows for the export preview |

---

## 4. Design system

Tokens live in `src/styles/tokens.css`. Components never hard-code hex values.

| Token | Value |
|---|---|
| Sidebar | `#111111` |
| Canvas | `#F6F5F2` |
| Surface | `#FFFFFF` |
| Text primary | `#151515` |
| Text secondary | `#6B6B6B` |
| Border | `#E8E4DC` |
| Accent (Indochine amber) | `#C9812B` |
| Accent bright | `#D4933A` |
| Accent light | `#F5E4C8` |
| Warning | `#B57614` |
| Error (muted red) | `#A63D3D` |
| Success (muted green) | `#3F7D58` |
| Info (blue-gray) | `#4F6B82` |

Type scale: page title 26/600 · section 17/600 · body 13.5 · table 12.5 · badge 11/500 ·
button 13/500. **Inter** for UI, **JetBrains Mono** for customer IDs and numeric keys.

Deliberate constraints, per the brief:

- One accent (amber) plus muted semantic colours. **No gradients anywhere.**
- Minimal shadows, crisp 1px borders, generous whitespace, dense tables.
- **No decorative charts.** The only data visuals are a load-vs-target bar row and a
  single-hue heat matrix, both of which answer a specific operational question.
- No transforms that shift layout on hover; states use background/border changes only.
- Desktop-first, laid out for 1440px and wider. Wide grids scroll horizontally rather than
  compressing columns into unreadability.

All 12 status badges from the brief are implemented: `Draft`, `Baseline`, `Immutable`,
`Editable`, `In Progress`, `Finalized`, `Warning`, `Blocked`, `Valid`, `Not in Master`,
`Route Mismatch`, `Default`.

---

## 5. Row model (Option A vs Option B)

**Option B — one row per customer per service day — is the primary working model**, as directed.

The Customers grid renders it as a **grouped table**, which is the mitigation for Option B's one
real risk (repeated rows looking like duplicates):

1. **Group header row** — one shaded row per customer carrying customer ID, name, master status,
   service pattern, delivery days, week(s), total revenue and the master/validation badges.
2. **Indent rail + explicit row count** — child rows are indented behind a vertical rail, and the
   header states *"5 service-day rows"*, so repetition is explained rather than accidental.
3. **Customer ID appears once** — child rows lead with the delivery day, the value that actually
   differs. Customer-level cells are dashed out on child rows.

Group headers collapse and expand. Revenue on a child row is the per-visit allocation
(`total ÷ service days`), e.g. 1000004 → `$372.36 / 5 = $74.47`, matching the brief.

Option A remains previewable: **Row Model Decision → "Preview Option A in the workspace"** swaps
the grid to one flat row per customer with delivery days as a chip group. The workspace header
shows which model is active.

---

## 6. How to review the notable states

Every state below is reachable by clicking. Nothing is a static mock.

### Baseline immutability
Route Workspace → click **Baseline** in the left option rail. A locked banner appears, the grid
gets a subtle hatch, and every write control is disabled with the tooltip *"The baseline can't be
edited. Save as a new option to make changes."* Click **Option 1** to return to editing.

### Selection states (Part H)
1. **None** — no bar.
2. **Manual** — tick any group checkbox. Shows `n selected`, the derived service-day row count,
   *"Only selected rows on screen will be changed."*, and a **Select all matching current
   filters** CTA.
3. **Select all matching** — click that CTA. The bar turns dark and states the full filter-scoped
   count, visually distinct from manual selection.
4. **Over the limit** — appears above 500 manually selected rows. The 26-customer sample can't
   reach it by clicking; it is implemented in `SelectionBar` and flagged *Partial* on the
   Alignment Checklist.

### Bulk assign — success, progress, failure (Parts I + J)
Select rows → **Assign Day / Week**. Pick a day and week (week pairs are shown visually).
The drawer carries a clearly-labelled **Prototype controls** block, because the brief documents
both a success *and* a failure outcome for the same Tuesday / Week 3 assignment:

- **Validation outcome: Pass** → **Validate Assignment** → success banner → **Apply Assignment**
  → 5-step progress with a live *"n of 1,300 customers checked"* counter → success toast.
- **Validation outcome: Fail** → *"No changes were applied."*, the violation table with reasons
  and per-row **Highlight**, and *"Exclude failing rows and retry"* / *"Cancel Assignment"*.
  Nothing is written unless you explicitly exclude and retry.
- **Cycle variant: 4 Week** → the week picker shows only Wk 1–4, with no pairs.

### Customer drawer (Part K)
- **Validation failure** — open 1000004, set Service Pattern to `2W`, ensure Tuesday is selected,
  **Save**. You get *"No changes were saved."* plus the inline pattern error. Days blocked by the
  chosen pattern are disabled with an explanatory tooltip.
- **Unsaved changes guard** — change a field, then close. *Keep Editing* / *Discard Changes*.
- **Not in Master** — open **1000108**. Informational banner, master fields read *Unavailable*.
- **Route Mismatch** — open **1000214**. Planned 972 vs Preferred 970.
- **Permission gate** — *Edit in Customer Master* is disabled for the analyst role.

### Quickest-time sequencer (Part M)
Available in three places: workspace toolbar (with **Ctrl+Q**), Routes tab row action, and the
Route drawer. Route drawer shows *idle → "Optimizing stop order…" → "Route re-sequenced. 12 min
saved."* with an undoable toast. Route **971** or **974** gives *"This route is already in its
quickest sequence."*

### Helper rule (Part L)
Route drawer → Scenario. Helpers are Presale-only; switching to Conventional or Delivery disables
the helper field, clears it, and explains why.

### Map / lasso
Toolbar → **Open Map** → **Lasso Select**. 260 route-coloured pins across the market; the lasso
highlights those inside it, reports customers/revenue/routes touched, and validates before
applying. Not live tracking — it is a static planning canvas.

### Balancer
Metrics tab → **Run Balancer**. Progress → a move proposal (3 moves, 35 customers) with
before/after deltas. Nothing is applied until you click **Apply 3 Moves**. Note the proposal is
honest that it *increases* route mismatches from 38 to 53.

### Import safety (column confirmation + error report)
`#/master-import`. **Validate File** stays disabled until you confirm the mappings and
acknowledge the destructive overwrites. Then the error report shows 5 Blocked / 2 Warning rows;
blocked rows must be explicitly excluded before import.

### Finalization and export guard
Toolbar → **Finalize**: blockers, warnings, passing checks, and an acknowledgement checkbox.
**Finalize Option** stays disabled while 9 blocking rows exist. `#/exports` → **Export Stop List**
is blocked for the same reasons; `#/stop-list` previews the format and column contract with
download disabled.

### Undo
Toasts on bulk assign, route reassign, lasso move, re-sequence and balancer apply carry **Undo**.
The Activity Feed and workspace Activity tab also offer per-event undo on recent writes.

---

## 6a. Prompt 2 — validation, audit and import (Parts A–Q)

The second part of V4 adds the validation, audit and import layer. It reuses the
Prompt 1 design language exactly and adds no new colours or type sizes.

### Five global rules

These are documented and demonstrated on `#/validation-system`:

1. **Disable, don't reject.** If the system already knows an action is not allowed,
   disable the control and explain why. A blocking modal is only correct when the
   action came from a menu or shortcut, where no disabled control is on screen.
2. **No silent failure.** Every failed write states how many rows failed, which
   rows, why, and what to do next.
3. **No full page reloads.** After a write, the grid, route metrics, route summary
   and activity feed each show their own `updating…` badge and settle
   independently. Implemented as `runPatch()` in `AppState`.
4. **Baseline is immutable** — in every surface, including the map lasso.
5. **Option 1 is editable**, and every write names the option it landed in.

### What each part adds

| Part | Feature | Where |
|---|---|---|
| A | Helper scenario validation — allowed on presale, blocked on conventional | Route drawer |
| B | Pattern/frequency validation — inline warning, View rule popover, Override applied badge | Customer drawer, bulk assign, grid, map |
| C | Bulk reassign validation — all valid / some blocked / all blocked | Reassign drawer |
| D | Map / Lasso View — 4 colour modes, 5 filters, 4 tools, selection panel | `#/map` |
| E | Lasso pre-move validation — 3 states with before/after impact | `#/map` |
| F | Read-only baseline map — lasso disabled, no polygon drawing | `#/map?version=baseline` |
| G | Activity feed — filters, expandable entries, capped affected rows | `#/activity` |
| H | Undo — available, success + patching, unavailable, conflict, permanent | `#/activity`, `#/ingestion` |
| I | Customer Master enhancement import — 5 screens, permission gated | `#/master-import` |
| J | Error report — 6 error codes with recommended corrections | `#/master-import` |
| K | Cycle length change edge case — no destructive action offered | `#/workspace?drawer=cycle` |
| L | Finalization with warnings — clean and blocked states | `#/finalize` |
| M | Export guard + Stop List — 4 states | `#/stop-list` |
| N | Open Decisions — 7 decisions with owners | `#/open-decisions` |
| O | Alignment Checklist — 14 sections, RN-111 note | `#/checklist` |
| P | RN-145 note — no user-facing design required | `#/checklist` |
| Q | Validation Message System — 7 message types | `#/validation-system` |

### Validation is rule-driven, not toggled

Wherever possible, which state you see follows from the data you pick, so each
state is reproducible from a link and defensible in front of the client:

| Surface | Input | Outcome |
|---|---|---|
| Bulk assign | Tuesday, Week 3 | All 1,300 pass |
| Bulk assign | Friday, Week 3 | 14 fail — patterns `8T` and `2T` never run Friday |
| Reassign route | destination 971 | All valid |
| Reassign route | destination 972 | 2 blocked (pattern + depot eligibility) |
| Reassign route | destination 973 | All blocked — **no proceed button** |
| Route drawer | route 970 (Presale) | Add Helper enabled |
| Route drawer | route 971 (Conventional) | Add Helper disabled + tooltip |

The remaining state switchers are on Finalize and Stop List, where the states are
mutually exclusive by definition (an option cannot be both clean and blocked).
They are labelled in the page header.

### Roles and permissions

`AppState` carries a role. Only **Admin** and **Ingest Admin** can run the
enhancement import or apply a pattern override; the **Routing Analyst** sees a
disabled CTA with an explanation. The role switcher is exposed on the import
screen and on the Validation Message System page so both states are reviewable.

---

## 7. Assumptions and decisions

Each of these is a real product decision made to keep the prototype coherent. The nine that
materially change the build are tracked with options and consequences on the **Open Decisions**
screen (`#/open-decisions`).

1. **Selection is customer-level, not row-level.** Ticking a customer selects all of its
   service-day rows. This keeps the bulk-scope language ("12 selected", "All 1,300 customers
   matching current filters selected") unambiguous. Row-level selection would allow moving a
   single Wednesday visit but makes scope copy much harder. *Open Decision #4.*
2. **Revenue is split evenly across service-day rows** (`total ÷ service days`). If Community
   Coffee allocates by day-of-week volume, this needs a rule before build. *Open Decision #2.*
3. **One row per service day, not per service day × week.** Following the brief's own Option B
   example, customer 1000004 (Mon–Fri, Wk 1+5) produces **5 rows**, not 10. The week column
   carries the pair's primary week. *Open Decision #3.*
4. **26 representative customers, session-scale counts.** The grid renders 26 real customers, but
   toolbars, footers, drawers and bulk actions all speak in 1,300-customer terms, because the
   language and layout at real scale is what needs reviewing. Both numbers are always visible in
   the grid footer so the prototype never misrepresents itself.
5. **Map pins are aggregated.** 260 pins each represent ~5 customers, so the canvas reads like a
   real market instead of a sparse scatter plot. The side panel states this.
6. **The Customers grid uses the brief's Option A column shapes for customer-level cells**
   (`Delivery Day: Mon Tue Wed Thu Fri`, `Delivery Week: Wk 1, Wk 5`) on the **group header**,
   with Option B's per-day values on the **child rows**. This is deliberate: the header describes
   the customer, the children describe the planning rows.
7. **Master Status sits in the Customer Master band**, not immediately after Customer ID. The
   brief lists it under both "Core columns" and "Customer Master Fields"; the band grouping is
   the point of grouped headers, so band membership won.
8. **Bulk operations are all-or-nothing.** No partial writes unless the analyst explicitly
   excludes failing rows and retries. Same contract for imports.
9. **Route mismatch is a warning, not a blocker.** Balancing inevitably creates mismatches, so
   making it a blocker would break the balancer. *Open Decision #7.*
10. **Not-in-Master customers export with blank address fields** plus a finalization warning,
    rather than being silently dropped. *Open Decision #6.*
11. **Export requires a finalized option and zero blockers.** The active Option 1 is Draft with 9
    blockers, so both the export guard and the disabled download are the realistic default state.
12. **Manual selection limit is 500 rows**, above which the analyst must switch to filter-scoped
    selection. *Open Decision #5.*
13. **Undo is last-action-only**, surfaced via toast and Activity. *Open Decision #8.*
14. **Sequencing scope is per route** in this prototype; per route + day + week is the more
    correct unit for a real stop list. *Open Decision #9.*
15. **Bulk-assign outcomes are rule-driven, not toggled.** The earlier Pass/Fail override was
    removed. Tuesday + Week 3 succeeds and Friday + Week 3 fails because of the service pattern
    rules, so each path is reproducible from a link and defensible in front of the client. The
    only remaining prototype-only affordances are the Populated/Empty-state toggles on Master
    Dataset and Sessions and the Cycle-variant control in the Assign drawer (which previews the
    4-week week picker). All are visually marked and would not ship.
16. **Design-decision screens are badged.** Design Foundation, Row Model Decision, Open Decisions
    and Alignment Checklist sit in a separate sidebar group and carry a *"not a production
    screen"* badge.
17. **The permanent-action confirmation lives with the reconcile flow, not undo.**
    The brief lists it under undo states, but it is a *forward* confirmation shown
    before a non-undoable action runs. It is therefore on Data Ingestion, where the
    Extension Report reconcile lives, and the reconcile's activity entry correctly
    carries a **No undo** badge.
18. **Helper assignment is a list, not a boolean.** The brief says "Add Helper", so
    a route can hold more than one helper from a named pool. Switching a route away
    from Presale clears its helpers rather than silently keeping an invalid state.
19. **Pattern overrides are permission-gated and audited.** Following the brief's
    recommended default: block by default unless override permission is confirmed.
    An override swaps the warning for an audited *Override applied* badge.
20. **Roles are visual only.** The analyst role is hard-coded; the Admin permission matrix and the
    Customer Master gate document intended behaviour rather than enforce it.

---

## 8. Known gaps

Stated plainly, and also listed on the Alignment Checklist:

- **No persistence.** All state is React state; a reload resets everything. Front-end only by
  design.
- **No real optimisation engine.** "12 min saved" and the balancer's proposal are fixed sample
  values, not computed.
- **No grid virtualisation.** A real 6,500-row grid needs windowing; 26 customers render here.
- **No basemap or geocoding.** The map is a schematic canvas, not a mapping library.
- **No authentication.** Permission gates are presentational.
- **Selection state 4** (over the 500-row manual limit) is implemented but not clickable at
  sample scale.
- **Search and some filters are illustrative** on secondary screens; the Customers grid filters
  and the Sessions filters are genuinely wired.

---

## 9. Project structure

```
routeops-cloud-v4-prototype/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── .gitignore                      # re-includes JSON (root ignores *.json)
├── README.md
└── src/
    ├── main.tsx                    # entry
    ├── App.tsx                     # shell + screen switch
    ├── styles/
    │   ├── tokens.css              # colour, type, spacing, radius, elevation
    │   └── global.css              # component library (hand-written)
    ├── data/
    │   └── mock.ts                 # ALL sample data + validation rules
    ├── state/
    │   └── AppState.tsx            # hash router, options, selection, toasts
    ├── components/
    │   ├── icons.tsx               # hand-rolled inline SVG icon set
    │   ├── ui.tsx                  # Button, Badge, Drawer, Modal, Banner, ...
    │   ├── Sidebar.tsx
    │   ├── TopBar.tsx
    │   └── ToastLayer.tsx
    └── screens/
        ├── Dashboard.tsx           DataIngestion.tsx    MasterDataset.tsx
        ├── Sessions.tsx            CreateSession.tsx    RouteWorkspace.tsx
        ├── CustomerMaster.tsx      MasterImport.tsx     ReferenceData.tsx
        ├── ActivityFeed.tsx        Exports.tsx          StopList.tsx
        ├── Admin.tsx               DesignFoundation.tsx RowModelDecision.tsx
        ├── OpenDecisions.tsx       Checklist.tsx
        └── workspace/
            ├── CustomersTab.tsx    RoutesTab.tsx        TerritoriesTab.tsx
            ├── HeatTab.tsx         MetricsTab.tsx       CompareTab.tsx
            ├── ActivityTab.tsx     AssignDrawer.tsx     CustomerDrawer.tsx
            ├── RouteDrawer.tsx     ReassignRouteDrawer.tsx
            └── MapLassoModal.tsx
```

---

## 10. Verification

The prototype was verified with a headless browser pass over all 17 screens and the main
interaction flows. Results at the time of delivery:

- **17/17 screens** render with the expected `h1` and non-trivial content
- **0 console errors**, 0 uncaught exceptions
- **0 TypeScript errors** under `strict`, including `noUnusedLocals` / `noUnusedParameters`
- Production build succeeds
- Verified interactively: all 7 workspace tabs; selection states 2 and 3; bulk assign
  pass/fail/progress/toast; the 4-week variant hiding Wk 5–8; customer drawer including
  Not-in-Master and Route Mismatch; baseline lock disabling writes; lasso selecting 66 pins;
  sequencer done and already-optimal states; finalize blocked by blockers; export guard;
  Create Session default tags and CTA gating; import validation gating; and the Option A
  row-model swap

Bugs found and fixed during verification, for the record:

1. Toasts fired twice because side effects sat inside `setState` updaters, which React
   StrictMode intentionally double-invokes. Progress counters were moved to locals.
2. The Metrics load bars rendered no fill — `.bar-fill` was an inline `<span>`, so `width`/`height`
   were ignored. Fixed with `display: block`.
3. Route data contradicted itself: 4 routes exceeded the 8h target by their minutes while the
   Routes table, footer and finalization checks all said 2. Routes 973 and 975 were corrected so
   every surface agrees on **2 over target (970, 977)**.
4. The Day/Week Heat matrix totalled 8,976 rows against the canonical ~6,500. Base weekday loads
   were rescaled.
5. Sidebar brand and profile lines ran together (missing `display: block`).
6. `1 customers selected` — pluralisation fixed in the assign drawer scope label.
