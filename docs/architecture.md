# NEXUS AI — System Architecture & Design Specification

NEXUS AI is an enterprise decision-support platform engineered to transform reactive inventory management into proactive demand forecasting and fulfillment optimization.

---

## 🏛️ High-Level Architecture Overview

```text
                               ┌──────────────────────────┐
                               │   NEXUS AI Frontend      │
                               │  React + Vite + Recharts │
                               └────────────┬─────────────┘
                                            │ REST APIs / JSON
                                            ▼
                               ┌──────────────────────────┐
                               │    FastAPI Gateway Layer │
                               └────────────┬─────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
  ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
  │ Time-Series ML Engine    │ │ Risk & Recommendation    │ │ Grounded AI Assistant    │
  │ XGBoost / SKLearn Trees  │ │ Reorder Point & EOQ      │ │ Context Query Engine     │
  └────────────┬─────────────┘ └────────────┬─────────────┘ └────────────┬─────────────┘
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            ▼
                               ┌──────────────────────────┐
                               │ Data Access Layer        │
                               │ CSV / PostgreSQL         │
                               └──────────────────────────┘
```

---

## 🔬 Core Subsystems & Logic

### 1. Demand Forecasting Engine (`ml/forecasting.py`)
- **Algorithms**: Gradient Boosted Trees (XGBoost / SKLearn `GradientBoostingRegressor`), 14-Day Moving Average Baseline.
- **Feature Pipeline**:
  - **Lags**: 1, 7, 14, 21, 28-day sales lag values.
  - **Rolling Windows**: 7, 14, 30-day rolling means and standard deviations.
  - **Calendar Attributes**: Day of week (weekend lift), Day of month, Month (seasonality), Holiday flags, Promotional spikes.
- **Uncertainty Bounds**: P10 and P90 empirical confidence bounds calculated using rolling standard error.

### 2. Inventory Risk Engine (`backend/services/risk_engine.py`)
- **Safety Stock ($SS$)**: $SS = Z \times \sigma_d \times \sqrt{L}$
- **Reorder Point ($ROP$)**: $ROP = (d \times L) + SS$
- **Risk Classification**:
  - `High Risk`: Current Stock $\le$ Safety Stock OR Days to Stockout $\le$ Supplier Lead Time.
  - `Medium Risk`: Current Stock $\le$ Reorder Point.
  - `Excess Overstock`: Current Stock $\ge$ 4 $\times$ Reorder Point.
  - `Healthy`: Current Stock within optimal bounds.

### 3. Smart Procurement & Supplier Scoring (`backend/services/recommendation_engine.py`)
- **Economic Order Quantity ($EOQ$)**:
  $$EOQ = \sqrt{\frac{2 D S}{H}}$$
  Where $D$ = Annualized demand, $S$ = Order setup cost ($150), $H$ = Holding cost per unit per year (20% of cost).
- **Recommended Purchase Quantity ($RPQ$)**:
  $$RPQ = (d \times (L + 7)) + SS - \text{Current Stock}$$
- **Multi-Criteria Vendor Scoring**:
  $$\text{Score} = (0.35 \times \text{Reliability}) + (0.25 \times \text{Price Score}) + (0.20 \times \text{OnTime Rate}) + (0.20 \times \text{Quality Score})$$

### 4. Order & Fulfillment Tracker (`backend/main.py`)
- Lifecycle states: `Created` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `In Transit` $\rightarrow$ `Delivered`.
- Automated exception detection flags delayed shipments exceeding expected delivery dates.

### 5. Grounded AI Business Assistant (`backend/services/ai_assistant.py`)
- Extracts intent from natural-language queries.
- Queries live application data before returning structured answers, summary cards, and quick navigation shortcuts.
