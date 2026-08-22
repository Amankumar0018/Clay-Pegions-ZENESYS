import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_nexus_dataset(output_dir="../data", days=365):
    """
    Generates realistic synthetic data for NEXUS AI platform:
    - Products (Inventory state, safety stock, lead time)
    - Historical Daily Sales (Trend, seasonality, day-of-week effects, promotional spikes)
    - Suppliers (Performance metrics, pricing factor, lead times, reliability scores)
    - Orders & Fulfillment status
    """
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    # 1. Products
    products = [
        {"product_id": "PROD-101", "name": "Apex Pro Ultra Laptop 15\"", "category": "Electronics", "unit_cost": 750.0, "unit_price": 1199.0, "current_stock": 42, "safety_stock": 65, "reorder_point": 120, "lead_time_days": 7},
        {"product_id": "PROD-102", "name": "OmniCharge Wireless Power Bank 20k", "category": "Electronics", "unit_cost": 22.0, "unit_price": 49.99, "current_stock": 180, "safety_stock": 250, "reorder_point": 400, "lead_time_days": 5},
        {"product_id": "PROD-103", "name": "AeroStream Ergonomic Mesh Chair", "category": "Office Furniture", "unit_cost": 140.0, "unit_price": 289.0, "current_stock": 15, "safety_stock": 35, "reorder_point": 70, "lead_time_days": 10},
        {"product_id": "PROD-104", "name": "PulseFit Active Smartwatch V2", "category": "Electronics", "unit_cost": 65.0, "unit_price": 149.0, "current_stock": 520, "safety_stock": 150, "reorder_point": 250, "lead_time_days": 6},
        {"product_id": "PROD-105", "name": "ThermalCore Insulated Water Bottle 1L", "category": "Consumer Goods", "unit_cost": 6.5, "unit_price": 24.99, "current_stock": 850, "safety_stock": 300, "reorder_point": 500, "lead_time_days": 4},
        {"product_id": "PROD-106", "name": "TitanGrip Industrial CNC Bearing Kit", "category": "Industrial Components", "unit_cost": 85.0, "unit_price": 175.0, "current_stock": 8, "safety_stock": 40, "reorder_point": 90, "lead_time_days": 14},
        {"product_id": "PROD-107", "name": "BioShield Sterile Medical Gloves Box", "category": "Medical Supplies", "unit_cost": 12.0, "unit_price": 29.99, "current_stock": 210, "safety_stock": 450, "reorder_point": 800, "lead_time_days": 8},
        {"product_id": "PROD-108", "name": "EchoWave Noise Cancelling Headphones", "category": "Electronics", "unit_cost": 95.0, "unit_price": 219.0, "current_stock": 95, "safety_stock": 100, "reorder_point": 180, "lead_time_days": 6},
    ]
    df_products = pd.DataFrame(products)
    df_products.to_csv(os.path.join(output_dir, "products.csv"), index=False)

    # 2. Suppliers
    suppliers = [
        {"supplier_id": "SUP-01", "name": "GlobalTech Logistics & Supply", "category": "Electronics", "rating": 4.8, "reliability_score": 0.96, "lead_time_days": 6, "price_factor": 1.0, "defect_rate": 0.012, "on_time_rate": 0.94},
        {"supplier_id": "SUP-02", "name": "Nexus Precision Components", "category": "Industrial Components", "rating": 4.6, "reliability_score": 0.92, "lead_time_days": 12, "price_factor": 0.92, "defect_rate": 0.021, "on_time_rate": 0.89},
        {"supplier_id": "SUP-03", "name": "Vanguard Office & Ergonomics", "category": "Office Furniture", "rating": 4.7, "reliability_score": 0.95, "lead_time_days": 9, "price_factor": 1.05, "defect_rate": 0.008, "on_time_rate": 0.96},
        {"supplier_id": "SUP-04", "name": "Apex MedSupply International", "category": "Medical Supplies", "rating": 4.9, "reliability_score": 0.98, "lead_time_days": 7, "price_factor": 1.02, "defect_rate": 0.003, "on_time_rate": 0.98},
        {"supplier_id": "SUP-05", "name": "Pacific Retail & Goods Distributors", "category": "Consumer Goods", "rating": 4.3, "reliability_score": 0.88, "lead_time_days": 4, "price_factor": 0.88, "defect_rate": 0.035, "on_time_rate": 0.84},
    ]
    df_suppliers = pd.DataFrame(suppliers)
    df_suppliers.to_csv(os.path.join(output_dir, "suppliers.csv"), index=False)

    # 3. Sales History (365 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    dates = [start_date + timedelta(days=i) for i in range(days)]

    sales_records = []
    base_demands = {
        "PROD-101": 15, "PROD-102": 55, "PROD-103": 8, "PROD-104": 35,
        "PROD-105": 90, "PROD-106": 12, "PROD-107": 110, "PROD-108": 25
    }

    for p in products:
        pid = p["product_id"]
        base_demand = base_demands[pid]
        unit_price = p["unit_price"]

        for d in dates:
            day_of_week = d.weekday() # 0-6
            month = d.month

            # Seasonality & weekend lift
            weekend_factor = 1.35 if day_of_week in [5, 6] else 0.95
            q4_seasonality = 1.4 if month in [11, 12] else 1.0
            summer_seasonality = 1.2 if month in [6, 7] and pid in ["PROD-105", "PROD-104"] else 1.0

            # Random promo spike (approx 5% probability)
            is_promo = random.random() < 0.05
            promo_factor = 1.8 if is_promo else 1.0

            # Trend over time (slight growth + noise)
            trend_factor = 1.0 + (dates.index(d) / days) * 0.15
            noise = np.random.normal(1.0, 0.12)

            qty = max(0, int(round(base_demand * weekend_factor * q4_seasonality * summer_seasonality * promo_factor * trend_factor * noise)))

            sales_records.append({
                "date": d.strftime("%Y-%m-%d"),
                "product_id": pid,
                "product_name": p["name"],
                "quantity_sold": qty,
                "unit_price": unit_price,
                "revenue": round(qty * unit_price, 2),
                "promotion_active": 1 if is_promo else 0,
                "holiday_flag": 1 if month == 12 and d.day in [24, 25, 31] else 0
            })

    df_sales = pd.DataFrame(sales_records)
    df_sales.to_csv(os.path.join(output_dir, "sales.csv"), index=False)

    # 4. Purchase Orders / Fulfillment Tracking
    orders = [
        {
            "order_id": "PO-9041",
            "product_id": "PROD-101",
            "product_name": "Apex Pro Ultra Laptop 15\"",
            "supplier_id": "SUP-01",
            "supplier_name": "GlobalTech Logistics & Supply",
            "quantity": 100,
            "unit_price": 750.0,
            "total_cost": 75000.0,
            "status": "In Transit",
            "created_date": (end_date - timedelta(days=5)).strftime("%Y-%m-%d"),
            "expected_delivery": (end_date + timedelta(days=2)).strftime("%Y-%m-%d"),
            "carrier": "FedEx Freight",
            "tracking_number": "FX-984210941",
            "delayed_flag": False,
            "delay_reason": "None"
        },
        {
            "order_id": "PO-9042",
            "product_id": "PROD-106",
            "product_name": "TitanGrip Industrial CNC Bearing Kit",
            "supplier_id": "SUP-02",
            "supplier_name": "Nexus Precision Components",
            "quantity": 80,
            "unit_price": 85.0,
            "total_cost": 6800.0,
            "status": "Shipped",
            "created_date": (end_date - timedelta(days=12)).strftime("%Y-%m-%d"),
            "expected_delivery": (end_date - timedelta(days=2)).strftime("%Y-%m-%d"),
            "carrier": "DHL Express",
            "tracking_number": "DHL-44019283",
            "delayed_flag": True,
            "delay_reason": "Customs clearance delay at port of entry"
        },
        {
            "order_id": "PO-9043",
            "product_id": "PROD-103",
            "product_name": "AeroStream Ergonomic Mesh Chair",
            "supplier_id": "SUP-03",
            "supplier_name": "Vanguard Office & Ergonomics",
            "quantity": 50,
            "unit_price": 140.0,
            "total_cost": 7000.0,
            "status": "Processing",
            "created_date": (end_date - timedelta(days=2)).strftime("%Y-%m-%d"),
            "expected_delivery": (end_date + timedelta(days=8)).strftime("%Y-%m-%d"),
            "carrier": "Maersk Logistics",
            "tracking_number": "MSK-77120394",
            "delayed_flag": False,
            "delay_reason": "None"
        },
        {
            "order_id": "PO-9044",
            "product_id": "PROD-107",
            "product_name": "BioShield Sterile Medical Gloves Box",
            "supplier_id": "SUP-04",
            "supplier_name": "Apex MedSupply International",
            "quantity": 600,
            "unit_price": 12.0,
            "total_cost": 7200.0,
            "status": "Delivered",
            "created_date": (end_date - timedelta(days=10)).strftime("%Y-%m-%d"),
            "expected_delivery": (end_date - timedelta(days=3)).strftime("%Y-%m-%d"),
            "carrier": "UPS Healthcare",
            "tracking_number": "UPS-11029384",
            "delayed_flag": False,
            "delay_reason": "None"
        },
        {
            "order_id": "PO-9045",
            "product_id": "PROD-102",
            "product_name": "OmniCharge Wireless Power Bank 20k",
            "supplier_id": "SUP-05",
            "supplier_name": "Pacific Retail & Goods Distributors",
            "quantity": 300,
            "unit_price": 22.0,
            "total_cost": 6600.0,
            "status": "Created",
            "created_date": (end_date - timedelta(days=1)).strftime("%Y-%m-%d"),
            "expected_delivery": (end_date + timedelta(days=4)).strftime("%Y-%m-%d"),
            "carrier": "XPO Logistics",
            "tracking_number": "XPO-88201948",
            "delayed_flag": False,
            "delay_reason": "None"
        }
    ]
    df_orders = pd.DataFrame(orders)
    df_orders.to_csv(os.path.join(output_dir, "orders.csv"), index=False)

    print(f"[OK] NEXUS AI Synthetic Dataset successfully generated in '{output_dir}'")
    return True

if __name__ == "__main__":
    generate_nexus_dataset()
