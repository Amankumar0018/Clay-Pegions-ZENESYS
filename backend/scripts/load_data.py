import os
import sys
import pandas as pd
from datetime import datetime, date

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from database import engine, SessionLocal, Base
from models import (
    Product, Supplier, Sales, Inventory, Order,
    Forecast, RiskEvent, Recommendation
)

DATA_DIR = os.path.abspath(os.path.join(BACKEND_DIR, "..", "data"))

def parse_date(val):
    if pd.isna(val) or val is None or str(val).strip() == "":
        return None
    if isinstance(val, date):
        return val
    if isinstance(val, datetime):
        return val.date()
    return datetime.strptime(str(val).strip(), "%Y-%m-%d").date()

def parse_bool(val):
    if pd.isna(val) or val is None:
        return False
    val_str = str(val).strip().lower()
    return val_str in ["true", "1", "t", "yes", "y"]

def load_data():
    print(f"[*] Starting NEXUS AI Data Loader")
    print(f"[*] Data directory: {DATA_DIR}")

    if not os.path.exists(DATA_DIR):
        print(f"[ERROR] Data directory does not exist: {DATA_DIR}")
        sys.exit(1)

    # Re-create database tables
    print("[*] Creating database schema tables...")
    Base.metadata.create_all(bind=engine)

    session = SessionLocal()

    try:
        # Clear existing data in reverse dependency order
        print("[*] Clearing any pre-existing records...")
        session.query(Recommendation).delete()
        session.query(RiskEvent).delete()
        session.query(Forecast).delete()
        session.query(Order).delete()
        session.query(Inventory).delete()
        session.query(Sales).delete()
        session.query(Supplier).delete()
        session.query(Product).delete()
        session.commit()

        # Track valid primary keys for FK validation
        product_ids = set()
        supplier_ids = set()
        row_counts = {}

        # 1. Load Products
        products_file = os.path.join(DATA_DIR, "products.csv")
        print(f"[*] Loading products from '{products_file}'...")
        df_p = pd.read_csv(products_file)
        req_p_cols = ["product_id", "product_name", "category", "unit_cost", "selling_price", "lead_time_days", "safety_stock", "reorder_point"]
        for col in req_p_cols:
            if col not in df_p.columns:
                raise ValueError(f"Missing required column '{col}' in products.csv")

        product_objects = []
        for _, row in df_p.iterrows():
            pid = str(row["product_id"]).strip()
            product_ids.add(pid)
            product_objects.append(Product(
                product_id=pid,
                product_name=str(row["product_name"]).strip(),
                category=str(row["category"]).strip(),
                unit_cost=float(row["unit_cost"]),
                selling_price=float(row["selling_price"]),
                lead_time_days=int(row["lead_time_days"]),
                safety_stock=int(row["safety_stock"]),
                reorder_point=int(row["reorder_point"]),
                active=parse_bool(row.get("active", True))
            ))
        session.bulk_save_objects(product_objects)
        session.commit()
        row_counts["products"] = len(product_objects)
        print(f"  [+] Products loaded: {row_counts['products']}")

        # 2. Load Suppliers
        suppliers_file = os.path.join(DATA_DIR, "suppliers.csv")
        print(f"[*] Loading suppliers from '{suppliers_file}'...")
        df_s = pd.read_csv(suppliers_file)
        req_s_cols = ["supplier_id", "supplier_name", "product_id", "unit_price", "lead_time_days", "reliability_score", "order_accuracy", "minimum_order_qty"]
        for col in req_s_cols:
            if col not in df_s.columns:
                raise ValueError(f"Missing required column '{col}' in suppliers.csv")

        supplier_objects = []
        for _, row in df_s.iterrows():
            sid = str(row["supplier_id"]).strip()
            pid = str(row["product_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in suppliers.csv not found in products!")
            supplier_ids.add(sid)
            supplier_objects.append(Supplier(
                supplier_id=sid,
                supplier_name=str(row["supplier_name"]).strip(),
                product_id=pid,
                unit_price=float(row["unit_price"]),
                lead_time_days=int(row["lead_time_days"]),
                reliability_score=float(row["reliability_score"]),
                order_accuracy=float(row["order_accuracy"]),
                minimum_order_qty=int(row["minimum_order_qty"])
            ))
        session.bulk_save_objects(supplier_objects)
        session.commit()
        row_counts["suppliers"] = len(supplier_objects)
        print(f"  [+] Suppliers loaded: {row_counts['suppliers']}")

        # 3. Load Sales
        sales_file = os.path.join(DATA_DIR, "sales.csv")
        print(f"[*] Loading sales from '{sales_file}'...")
        df_sales = pd.read_csv(sales_file)
        req_sales_cols = ["sale_date", "product_id", "units_sold", "unit_price"]
        for col in req_sales_cols:
            if col not in df_sales.columns:
                raise ValueError(f"Missing required column '{col}' in sales.csv")

        sales_objects = []
        for idx, row in df_sales.iterrows():
            pid = str(row["product_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in sales.csv at row {idx} not found in products!")
            sales_objects.append(Sales(
                sale_id=int(row["sale_id"]) if "sale_id" in row and not pd.isna(row["sale_id"]) else None,
                sale_date=parse_date(row["sale_date"]),
                product_id=pid,
                units_sold=int(row["units_sold"]),
                unit_price=float(row["unit_price"]),
                promotion=parse_bool(row.get("promotion", False)),
                discount_pct=float(row.get("discount_pct", 0.0) or 0.0),
                sales_channel=str(row.get("sales_channel", "Online")).strip()
            ))
        session.bulk_save_objects(sales_objects)
        session.commit()
        row_counts["sales"] = len(sales_objects)
        print(f"  [+] Sales records loaded: {row_counts['sales']}")

        # 4. Load Inventory
        inventory_file = os.path.join(DATA_DIR, "inventory.csv")
        print(f"[*] Loading inventory from '{inventory_file}'...")
        df_inv = pd.read_csv(inventory_file)
        req_inv_cols = ["snapshot_date", "product_id", "opening_stock", "units_received", "units_sold", "closing_stock", "reserved_stock"]
        for col in req_inv_cols:
            if col not in df_inv.columns:
                raise ValueError(f"Missing required column '{col}' in inventory.csv")

        inventory_objects = []
        for idx, row in df_inv.iterrows():
            pid = str(row["product_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in inventory.csv at row {idx} not found in products!")
            inventory_objects.append(Inventory(
                inventory_id=int(row["inventory_id"]) if "inventory_id" in row and not pd.isna(row["inventory_id"]) else None,
                snapshot_date=parse_date(row["snapshot_date"]),
                product_id=pid,
                opening_stock=int(row["opening_stock"]),
                units_received=int(row["units_received"]),
                units_sold=int(row["units_sold"]),
                closing_stock=int(row["closing_stock"]),
                reserved_stock=int(row["reserved_stock"])
            ))
        session.bulk_save_objects(inventory_objects)
        session.commit()
        row_counts["inventory"] = len(inventory_objects)
        print(f"  [+] Inventory records loaded: {row_counts['inventory']}")

        # 5. Load Orders
        orders_file = os.path.join(DATA_DIR, "orders.csv")
        print(f"[*] Loading orders from '{orders_file}'...")
        df_o = pd.read_csv(orders_file)
        req_o_cols = ["order_id", "product_id", "supplier_id", "order_date", "quantity", "expected_delivery", "status", "unit_price"]
        for col in req_o_cols:
            if col not in df_o.columns:
                raise ValueError(f"Missing required column '{col}' in orders.csv")

        order_objects = []
        for idx, row in df_o.iterrows():
            pid = str(row["product_id"]).strip()
            sid = str(row["supplier_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in orders.csv at row {idx} not found in products!")
            if sid not in supplier_ids:
                raise ValueError(f"FK Integrity Violation: supplier_id '{sid}' in orders.csv at row {idx} not found in suppliers!")
            
            order_objects.append(Order(
                order_id=str(row["order_id"]).strip(),
                product_id=pid,
                supplier_id=sid,
                order_date=parse_date(row["order_date"]),
                quantity=int(row["quantity"]),
                expected_delivery=parse_date(row["expected_delivery"]),
                actual_delivery=parse_date(row.get("actual_delivery")),
                status=str(row["status"]).strip(),
                unit_price=float(row["unit_price"])
            ))
        session.bulk_save_objects(order_objects)
        session.commit()
        row_counts["orders"] = len(order_objects)
        print(f"  [+] Orders loaded: {row_counts['orders']}")

        # 6. Load Forecasts
        forecasts_file = os.path.join(DATA_DIR, "forecasts.csv")
        print(f"[*] Loading forecasts from '{forecasts_file}'...")
        df_f = pd.read_csv(forecasts_file)
        req_f_cols = ["product_id", "forecast_date", "target_date", "predicted_demand", "lower_bound", "upper_bound", "model_name", "model_version"]
        for col in req_f_cols:
            if col not in df_f.columns:
                raise ValueError(f"Missing required column '{col}' in forecasts.csv")

        forecast_objects = []
        for idx, row in df_f.iterrows():
            pid = str(row["product_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in forecasts.csv at row {idx} not found in products!")
            forecast_objects.append(Forecast(
                forecast_id=int(row["forecast_id"]) if "forecast_id" in row and not pd.isna(row["forecast_id"]) else None,
                product_id=pid,
                forecast_date=parse_date(row["forecast_date"]),
                target_date=parse_date(row["target_date"]),
                predicted_demand=float(row["predicted_demand"]),
                lower_bound=float(row["lower_bound"]),
                upper_bound=float(row["upper_bound"]),
                model_name=str(row["model_name"]).strip(),
                model_version=str(row["model_version"]).strip()
            ))
        session.bulk_save_objects(forecast_objects)
        session.commit()
        row_counts["forecasts"] = len(forecast_objects)
        print(f"  [+] Forecasts loaded: {row_counts['forecasts']}")

        # 7. Load Risk Events
        risks_file = os.path.join(DATA_DIR, "risk_events.csv")
        print(f"[*] Loading risk events from '{risks_file}'...")
        df_r = pd.read_csv(risks_file)
        req_r_cols = ["product_id", "evaluation_date", "current_stock", "forecast_demand_7d", "risk_level", "days_to_stockout", "reason"]
        for col in req_r_cols:
            if col not in df_r.columns:
                raise ValueError(f"Missing required column '{col}' in risk_events.csv")

        risk_objects = []
        for idx, row in df_r.iterrows():
            pid = str(row["product_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in risk_events.csv at row {idx} not found in products!")
            risk_objects.append(RiskEvent(
                risk_id=int(row["risk_id"]) if "risk_id" in row and not pd.isna(row["risk_id"]) else None,
                product_id=pid,
                evaluation_date=parse_date(row["evaluation_date"]),
                current_stock=int(row["current_stock"]),
                forecast_demand_7d=float(row["forecast_demand_7d"]),
                risk_level=str(row["risk_level"]).strip(),
                days_to_stockout=float(row["days_to_stockout"]),
                reason=str(row["reason"]).strip()
            ))
        session.bulk_save_objects(risk_objects)
        session.commit()
        row_counts["risk_events"] = len(risk_objects)
        print(f"  [+] Risk Events loaded: {row_counts['risk_events']}")

        # 8. Load Recommendations
        recos_file = os.path.join(DATA_DIR, "recommendations.csv")
        print(f"[*] Loading recommendations from '{recos_file}'...")
        df_reco = pd.read_csv(recos_file)
        req_reco_cols = ["product_id", "recommendation_date", "risk_level", "recommended_action", "recommended_quantity", "supplier_id", "supplier_score", "estimated_unit_cost", "estimated_purchase_value", "rationale"]
        for col in req_reco_cols:
            if col not in df_reco.columns:
                raise ValueError(f"Missing required column '{col}' in recommendations.csv")

        reco_objects = []
        for idx, row in df_reco.iterrows():
            pid = str(row["product_id"]).strip()
            sid = str(row["supplier_id"]).strip()
            if pid not in product_ids:
                raise ValueError(f"FK Integrity Violation: product_id '{pid}' in recommendations.csv at row {idx} not found in products!")
            if sid not in supplier_ids:
                raise ValueError(f"FK Integrity Violation: supplier_id '{sid}' in recommendations.csv at row {idx} not found in suppliers!")
            
            reco_objects.append(Recommendation(
                recommendation_id=int(row["recommendation_id"]) if "recommendation_id" in row and not pd.isna(row["recommendation_id"]) else None,
                product_id=pid,
                recommendation_date=parse_date(row["recommendation_date"]),
                risk_level=str(row["risk_level"]).strip(),
                recommended_action=str(row["recommended_action"]).strip(),
                recommended_quantity=int(row["recommended_quantity"]),
                supplier_id=sid,
                supplier_score=float(row["supplier_score"]),
                estimated_unit_cost=float(row["estimated_unit_cost"]),
                estimated_purchase_value=float(row["estimated_purchase_value"]),
                rationale=str(row["rationale"]).strip()
            ))
        session.bulk_save_objects(reco_objects)
        session.commit()
        row_counts["recommendations"] = len(reco_objects)
        print(f"  [+] Recommendations loaded: {row_counts['recommendations']}")

        print("\n==========================================")
        print("[SUCCESS] All official datasets loaded into SQLite DB successfully!")
        print("==========================================")
        for tbl, count in row_counts.items():
            print(f"  - {tbl.capitalize()}: {count:,} rows")
        print("==========================================\n")
        return row_counts

    except Exception as e:
        session.rollback()
        print(f"\n[FATAL ERROR] Data loading failed: {e}")
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    load_data()
