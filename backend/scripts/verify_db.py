import os
import sys

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from database import engine, SessionLocal
from models import Product, Supplier, Sales, Inventory, Order, Forecast, RiskEvent, Recommendation

def verify_database():
    print("==========================================")
    print("[*] NEXUS AI Database Verification Suite")
    print("==========================================")

    session = SessionLocal()
    try:
        tables = [
            ("Products", Product),
            ("Suppliers", Supplier),
            ("Sales", Sales),
            ("Inventory", Inventory),
            ("Orders", Order),
            ("Forecasts", Forecast),
            ("Risk Events", RiskEvent),
            ("Recommendations", Recommendation),
        ]

        print("\n--- 1. Table Row Counts ---")
        row_counts = {}
        for name, model in tables:
            count = session.query(model).count()
            row_counts[name] = count
            print(f"  [OK] {name:<16}: {count:>6,} rows")

        print("\n--- 2. Foreign Key Integrity Tests ---")
        
        # Test FK 1: Supplier -> Product
        sample_supplier = session.query(Supplier).first()
        assert sample_supplier is not None, "No supplier found!"
        assert sample_supplier.product is not None, "Supplier product FK relationship failed!"
        print(f"  [OK] Supplier FK Test: Supplier '{sample_supplier.supplier_name}' ({sample_supplier.supplier_id}) -> Product '{sample_supplier.product.product_name}' ({sample_supplier.product_id})")

        # Test FK 2: Order -> Product & Supplier
        sample_order = session.query(Order).first()
        assert sample_order is not None, "No order found!"
        assert sample_order.product is not None, "Order product FK relationship failed!"
        assert sample_order.supplier is not None, "Order supplier FK relationship failed!"
        print(f"  [OK] Order FK Test   : Order '{sample_order.order_id}' -> Product '{sample_order.product.product_name}' & Supplier '{sample_order.supplier.supplier_name}'")

        # Test FK 3: Sales -> Product
        sample_sale = session.query(Sales).first()
        assert sample_sale is not None, "No sales record found!"
        assert sample_sale.product is not None, "Sales product FK relationship failed!"
        print(f"  [OK] Sales FK Test   : Sale #{sample_sale.sale_id} on {sample_sale.sale_date} -> Product '{sample_sale.product.product_name}' ({sample_sale.units_sold} units)")

        # Test FK 4: Recommendation -> Product & Supplier
        sample_reco = session.query(Recommendation).first()
        assert sample_reco is not None, "No recommendation found!"
        assert sample_reco.product is not None, "Recommendation product FK relationship failed!"
        assert sample_reco.supplier is not None, "Recommendation supplier FK relationship failed!"
        print(f"  [OK] Reco FK Test    : Reco #{sample_reco.recommendation_id} ({sample_reco.recommended_action}) -> Product '{sample_reco.product.product_name}' & Supplier '{sample_reco.supplier.supplier_name}'")

        print("\n==========================================")
        print("[SUCCESS] All database verification tests passed!")
        print("==========================================\n")
        return True

    except Exception as e:
        print(f"\n[FAIL] Database verification error: {e}")
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    verify_database()
