import os
import sys
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict

# Include parent dir so we can import ML engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.data_generator import generate_nexus_dataset
from ml.forecasting import NexusForecastingEngine
from backend.services.risk_engine import calculate_inventory_risks
from backend.services.recommendation_engine import generate_procurement_recommendations
from backend.services.ai_assistant import process_ai_query
from database import engine, SessionLocal
from models import Product, Supplier, Sales, Inventory, Order

app = FastAPI(
    title="NEXUS AI - Demand & Fulfillment API",
    description="Enterprise API layer for demand forecasting, inventory risk detection, procurement recommendations, and order tracking.",
    version="0.1.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))

# Initialize Dataset on startup if missing
def ensure_dataset():
    if not os.path.exists(os.path.join(DATA_DIR, "products.csv")):
        generate_nexus_dataset(output_dir=DATA_DIR)

ensure_dataset()

# Initialize ML Forecasting Engine
forecaster = NexusForecastingEngine(data_dir=DATA_DIR)

# Helper functions to load data frames from Database (with CSV fallback)
def get_products():
    try:
        df = pd.read_sql("SELECT * FROM products", con=engine)
        if not df.empty:
            return df
    except Exception:
        pass
    return pd.read_csv(os.path.join(DATA_DIR, "products.csv"))

def get_suppliers():
    try:
        df = pd.read_sql("SELECT * FROM suppliers", con=engine)
        if not df.empty:
            return df
    except Exception:
        pass
    return pd.read_csv(os.path.join(DATA_DIR, "suppliers.csv"))

def get_sales():
    try:
        df = pd.read_sql("SELECT * FROM sales", con=engine)
        if not df.empty:
            return df
    except Exception:
        pass
    return pd.read_csv(os.path.join(DATA_DIR, "sales.csv"))

def get_orders():
    try:
        df = pd.read_sql("SELECT * FROM orders", con=engine)
        if not df.empty:
            # Map column names if needed to match API contracts
            if 'order_date' in df.columns and 'created_date' not in df.columns:
                df['created_date'] = df['order_date']
            if 'delayed_flag' not in df.columns and 'status' in df.columns:
                df['delayed_flag'] = df['status'] == 'DELAYED'
            if 'delay_reason' not in df.columns:
                df['delay_reason'] = "Supplier shipment delay"
            if 'carrier' not in df.columns:
                df['carrier'] = "Express Freight"
            if 'tracking_number' not in df.columns:
                df['tracking_number'] = df['order_id'].apply(lambda x: f"NEXUS-{x}")
            if 'product_name' not in df.columns:
                prods = get_products().set_index('product_id')['product_name'].to_dict()
                df['product_name'] = df['product_id'].map(prods).fillna("Product")
            if 'supplier_name' not in df.columns:
                supps = get_suppliers().set_index('supplier_id')['supplier_name'].to_dict()
                df['supplier_name'] = df['supplier_id'].map(supps).fillna("Supplier")
            return df
    except Exception:
        pass
    return pd.read_csv(os.path.join(DATA_DIR, "orders.csv"))

# Request models
class CreateOrderRequest(BaseModel):
    product_id: str
    supplier_id: str
    quantity: int
    unit_price: float

class SimulationRequest(BaseModel):
    demand_surge_percent: float = 0.0 # e.g. +50.0 for 50% surge
    lead_time_spike_days: int = 0      # e.g. +5 days
    price_inflation_percent: float = 0.0 # e.g. +10%

class ChatQueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {
        "platform": "NEXUS AI",
        "status": "Operational",
        "version": "0.1.0",
        "docs_url": "/docs"
    }

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    products_df = get_products()
    sales_df = get_sales()
    orders_df = get_orders()
    suppliers_df = get_suppliers()

    risks = calculate_inventory_risks(products_df, sales_df)
    recos = generate_procurement_recommendations(products_df, suppliers_df, sales_df)

    high_risk_count = sum(1 for r in risks if r['risk_level'] == 'High')
    medium_risk_count = sum(1 for r in risks if r['risk_level'] == 'Medium')

    reorder_items_count = sum(1 for r in recos if r['reorder_needed'])
    total_reorder_est_spend = sum(r['est_cost'] for r in recos if r['reorder_needed'])

    active_orders_count = len(orders_df[orders_df['status'] != 'Delivered'])
    delayed_orders_count = len(orders_df[orders_df['delayed_flag'] == True])

    delivered_count = len(orders_df[orders_df['status'] == 'Delivered'])
    total_orders_count = len(orders_df)
    on_time_fulfillment_rate = round((delivered_count / total_orders_count * 100.0), 1) if total_orders_count > 0 else 100.0

    return {
        "kpis": {
            "total_products": len(products_df),
            "high_risk_stockouts": high_risk_count,
            "medium_risk_stockouts": medium_risk_count,
            "pending_purchase_orders": reorder_items_count,
            "total_recommended_spend": round(total_reorder_est_spend, 2),
            "active_shipments": active_orders_count,
            "delayed_shipments": delayed_orders_count,
            "on_time_fulfillment_percent": on_time_fulfillment_rate
        },
        "critical_alerts": [r for r in risks if r['risk_level'] == 'High']
    }

@app.get("/api/products")
def list_products():
    return get_products().to_dict(orient="records")

@app.get("/api/forecast/{product_id}")
def get_product_forecast(product_id: str, horizon_days: int = 30):
    return forecaster.forecast_product(product_id, horizon_days=horizon_days)

@app.get("/api/inventory/risks")
def get_inventory_risks():
    return calculate_inventory_risks(get_products(), get_sales())

@app.get("/api/procurement/recommendations")
def get_procurement_recommendations():
    return generate_procurement_recommendations(get_products(), get_suppliers(), get_sales())

@app.get("/api/suppliers/rankings")
def get_suppliers_rankings():
    return get_suppliers().to_dict(orient="records")

@app.get("/api/orders")
def list_orders():
    return get_orders().to_dict(orient="records")

@app.post("/api/orders/create")
def create_purchase_order(order_req: CreateOrderRequest):
    orders_df = get_orders()
    products_df = get_products()
    suppliers_df = get_suppliers()

    p_match = products_df[products_df['product_id'] == order_req.product_id]
    s_match = suppliers_df[suppliers_df['supplier_id'] == order_req.supplier_id]

    p_name = p_match.iloc[0]['product_name'] if (not p_match.empty and 'product_name' in p_match.columns) else (p_match.iloc[0]['name'] if not p_match.empty else "Product")
    s_name = s_match.iloc[0]['supplier_name'] if (not s_match.empty and 'supplier_name' in s_match.columns) else (s_match.iloc[0]['name'] if not s_match.empty else "Supplier")

    new_order_id = f"PO-90{len(orders_df) + 46}"
    total_cost = round(order_req.quantity * order_req.unit_price, 2)
    today_date = pd.Timestamp.now().date()
    exp_date = (pd.Timestamp.now() + pd.Timedelta(days=7)).date()

    # Persist into SQLite DB
    try:
        session = SessionLocal()
        db_order = Order(
            order_id=new_order_id,
            product_id=order_req.product_id,
            supplier_id=order_req.supplier_id,
            order_date=today_date,
            quantity=order_req.quantity,
            expected_delivery=exp_date,
            actual_delivery=None,
            status="CREATED",
            unit_price=order_req.unit_price
        )
        session.add(db_order)
        session.commit()
        session.close()
    except Exception as e:
        print(f"[WARN] Could not persist order to DB: {e}")

    new_order = {
        "order_id": new_order_id,
        "product_id": order_req.product_id,
        "product_name": p_name,
        "supplier_id": order_req.supplier_id,
        "supplier_name": s_name,
        "quantity": order_req.quantity,
        "unit_price": order_req.unit_price,
        "total_cost": total_cost,
        "status": "Created",
        "created_date": today_date.strftime("%Y-%m-%d"),
        "expected_delivery": exp_date.strftime("%Y-%m-%d"),
        "carrier": "Express Freight",
        "tracking_number": f"NEXUS-{new_order_id}",
        "delayed_flag": False,
        "delay_reason": "None"
    }

    return {
        "status": "Success",
        "message": f"Purchase Order {new_order_id} created successfully!",
        "order": new_order
    }

@app.post("/api/simulation/demand")
def simulate_demand(sim_req: SimulationRequest):
    """
    Recalculates inventory risks and purchase recommendations under simulated parameters:
    - demand surge (% increase)
    - lead time spike (days increase)
    - price inflation (% increase)
    """
    products_df = get_products()
    suppliers_df = get_suppliers()
    sales_df = get_sales().copy()

    # Apply demand surge multiplier to historical sales for calculation
    demand_mult = 1.0 + (sim_req.demand_surge_percent / 100.0)
    sales_df['quantity_sold'] = sales_df['quantity_sold'] * demand_mult

    # Apply lead time spike
    products_sim = products_df.copy()
    products_sim['lead_time_days'] = products_sim['lead_time_days'] + sim_req.lead_time_spike_days

    # Apply price inflation
    products_sim['unit_cost'] = products_sim['unit_cost'] * (1.0 + sim_req.price_inflation_percent / 100.0)

    sim_risks = calculate_inventory_risks(products_sim, sales_df)
    sim_recos = generate_procurement_recommendations(products_sim, suppliers_df, sales_df)

    high_risk_count = sum(1 for r in sim_risks if r['risk_level'] == 'High')
    reorder_items_count = sum(1 for r in sim_recos if r['reorder_needed'])
    total_spend = sum(r['est_cost'] for r in sim_recos if r['reorder_needed'])

    return {
        "simulation_parameters": sim_req.dict(),
        "summary": {
            "high_risk_stockouts": high_risk_count,
            "pending_purchase_orders": reorder_items_count,
            "total_recommended_spend": round(total_spend, 2)
        },
        "simulated_risks": sim_risks,
        "simulated_recommendations": sim_recos
    }

@app.get("/api/model-evaluation")
def get_model_evaluation():
    return forecaster.evaluate_models()

@app.post("/api/ai-assistant/chat")
def chat_ai_assistant(req: ChatQueryRequest):
    products_df = get_products()
    suppliers_df = get_suppliers()
    sales_df = get_sales()
    orders_df = get_orders()

    risks_data = calculate_inventory_risks(products_df, sales_df)
    reco_data = generate_procurement_recommendations(products_df, suppliers_df, sales_df)

    return process_ai_query(
        req.query,
        products_df, suppliers_df, sales_df, orders_df,
        risks_data, reco_data
    )
