# 🚀 MILEY — AI Supply Chain Copilot for NetSuite

> **NetSuite records what happened. MILEY predicts what happens next, explains why, recommends what to do, and turns that decision into action.**

MILEY is an AI-powered Supply Chain Copilot that sits on top of NetSuite and turns ERP data into predictive, explainable, and executable business decisions. It analyzes historical sales, inventory, supplier, and order data to forecast future demand, identify stockout and fulfillment risks, recommend replenishment actions and suitable vendors, and execute purchase orders in NetSuite.

Built for the **ZENESYS Hackathon**.

---

## ✨ Key Features

* 📈 **Demand Forecasting** — Predict future product demand using XGBoost time-series ML models with P10/P90 confidence bounds.
* ⚠️ **Inventory Risk Detection** — Detect stockout and overstock risks before operational impact.
* 🛒 **Smart Procurement Recommendations** — Calculate Economic Order Quantity (EOQ), Safety Stock ($SS$), and Recommended Purchase Quantity (RPQ).
* 🏆 **Multi-Criteria Vendor Ranking** — Evaluate suppliers using weighted scores (Price, Reliability %, Delivery Days, Quality %).
* 🚚 **Order & Fulfillment Tracking** — Interactive shipment timeline stepper and delayed delivery alerts.
* 🧪 **What-If Demand Simulator** — Stress-test supply chain against demand surges, lead time delays, and cost inflation.
* 📊 **Model Evaluation Studio** — Empirical proof demonstrating ~38.4% WAPE accuracy improvement over moving average baselines.
* 🤖 **Grounded AI Business Assistant** — Natural language interface retrieving live context to answer operational questions.

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Start the Backend API (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API documentation will be available at:
`http://localhost:8000/docs`

---

### 2. Start the Frontend Dashboard (React + Vite)

Open a new terminal tab/window:

```bash
cd frontend
npm install
npm run dev
```

The application will be running at:
`http://localhost:3000` (or `http://localhost:5173`)

---

## 🏗️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend API**: Python, FastAPI, Pydantic, Uvicorn
- **Machine Learning**: Pandas, NumPy, Scikit-Learn, XGBoost
- **AI Assistant**: Grounded Context Retrieval Engine

---

## 📄 Documentation

- [Architecture Specification](docs/architecture.md)
- [Model Evaluation & Benchmarks](docs/model-evaluation.md)

---

## ⚖️ License

MIT License © 2026 NEXUS AI Team
