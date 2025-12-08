# QUANTICAST AI Design Guidelines

## Design Approach
**Reference-Based: Professional Trading Platforms**
Drawing inspiration from Bloomberg Terminal, TradingView, and modern fintech dashboards (Robinhood, Webull). This is a utility-first application where data density, clarity, and professional aesthetics are paramount.

**Core Principles:**
- Information hierarchy over decoration
- Data legibility at all times
- Professional, authoritative presence
- Fast visual scanning for critical information

---

## Layout System

**Spacing Scale:** Use Tailwind units of 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Tight spacing (p-2, gap-3) for data-dense cards
- Medium spacing (p-4, p-6) for content sections
- Generous spacing (p-8, p-12) for major section breaks

**Grid Strategy:**
- Main container: max-w-7xl mx-auto px-4
- Multi-step workflow: Single column on mobile, two-column split on desktop (image preview | controls)
- Results dashboard: Three-column grid for metric cards (grid-cols-1 md:grid-cols-3)
- Analysis history: List view with expandable rows

---

## Typography

**Font Families:**
- Primary: 'Inter' (already defined) - for all UI text
- Monospace: 'JetBrains Mono' (already defined) - for ticker symbols, prices, numerical data

**Hierarchy:**
- Page titles: text-3xl font-bold
- Section headers: text-xl font-semibold
- Card titles: text-lg font-medium
- Body text: text-sm font-normal
- Data labels: text-xs uppercase tracking-wide font-medium
- Numerical displays: text-2xl font-mono font-bold

---

## Component Library

### Navigation
- Top bar with app logo/name, centered strategy selector (dropdown), history icon button (right-aligned)
- Minimal, single-row header with dark background and subtle border-bottom

### Upload Flow
- Large dropzone card (border-dashed, hover state with border accent)
- Camera capture button (prominent, with icon)
- Image preview with zoom capability
- Strategy selector as prominent button grid (3-4 columns) with icons, strategy name, and brief descriptor

### Analysis Dashboard
- **Grade Badge:** Large, prominent display (A+/A/B/C) with appropriate visual weight
- **Metric Cards:** Grid layout showing:
  - Visual Score, Data Score, Sentiment Score, Risk-Reward Score, Momentum Score
  - Each card: Icon, label, numerical value, mini progress indicator
- **Trade Plan Card:** Distinct visual treatment with:
  - Bias (BUY/SELL) with directional indicator
  - Entry Zone, Stop Loss, TP1, TP2 in structured table format
  - Action button (BUY STOP/SELL STOP/WAIT) with clear visual hierarchy

### Data Visualization
- **Key Levels Table:** Compact table with alternating row backgrounds
- **Confidence Meter:** Horizontal bar with percentage
- **Grounding Sources:** Collapsible list with external link indicators

### Analysis Logs
- Terminal-style log display with monospace font
- Timestamp prefix for each entry
- Auto-scroll to bottom
- Dark panel with slightly lighter text

### History/Reports
- Card-based list with:
  - Ticker symbol (large, mono), timestamp, grade badge
  - Quick stats preview (bias, strategy used)
  - Click to expand for full analysis
  - Delete/archive actions

---

## Interactions

**Progress States:**
- Multi-step indicator at top (Upload → Validating → Analyzing → Results)
- Active step highlighted, completed steps with checkmark
- Loading states: Spinner with descriptive text ("Analyzing chart patterns...", "Grounding with real-time data...")

**Error Handling:**
- Inline validation errors below inputs
- Modal alerts for critical failures
- Rejection reasons displayed prominently with retry option

**Micro-interactions:**
- Smooth transitions between workflow steps (fade-in, 300ms)
- Hover states on all interactive elements (subtle background change)
- Grade badge entrance animation (scale-in on result reveal)

---

## Visual Treatment

**Depth & Hierarchy:**
- Use existing card backgrounds (fin-panel, fin-card) for layering
- Subtle shadows on elevated elements (strategy cards, metric displays)
- Border treatment (fin-border) to separate sections without heavy dividers

**Accent Usage:**
- Bull/bear colors ONLY for directional indicators and bias displays
- fin-accent (blue) for primary actions, links, active states
- Never use green/red for non-financial indicators

**Imagery:**
No hero images. This is a data-first application. The uploaded chart becomes the hero element in the analysis view.

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts throughout
- Stacked metric cards
- Full-width strategy selector buttons
- Collapsible analysis sections

**Desktop (≥ 768px):**
- Two-column split for upload flow (preview | controls)
- Three-column metric grid
- Side-by-side comparison views in history

**Critical:** Maintain data legibility at all viewport sizes. Never sacrifice readability for layout efficiency.