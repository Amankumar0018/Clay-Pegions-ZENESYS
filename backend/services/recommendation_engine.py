import numpy as np
import pandas as pd

def generate_procurement_recommendations(products_df, suppliers_df, sales_df):
    """
    Computes Economic Order Quantity (EOQ), Recommended Purchase Quantity (RPQ),
    and multi-criteria supplier ranking for each product.
    """
    recommendations = []

    # Calculate annual demand estimate from recent 30-day sales
    recent_sales = sales_df.copy()
    if not recent_sales.empty:
        date_col = 'date' if 'date' in recent_sales.columns else ('sale_date' if 'sale_date' in recent_sales.columns else None)
        if date_col:
            recent_sales['date'] = pd.to_datetime(recent_sales[date_col])
            max_date = recent_sales['date'].max()
            cutoff = max_date - pd.Timedelta(days=30)
            recent_30 = recent_sales[recent_sales['date'] >= cutoff]
            avg_daily_demand = recent_30.groupby('product_id')['quantity_sold' if 'quantity_sold' in recent_30.columns else 'units_sold'].mean().to_dict()
        else:
            avg_daily_demand = {}
    else:
        avg_daily_demand = {}

    for _, p in products_df.iterrows():
        pid = p['product_id']
        pname = p.get('product_name', p.get('name', f'Product {pid}'))
        pcategory = p.get('category', 'General')
        stock = p.get('current_stock', p.get('closing_stock', 0))
        safety_stock = p.get('safety_stock', 10)
        rop = p.get('reorder_point', 20)
        lead_time = p.get('lead_time_days', 7)
        unit_cost = p.get('unit_cost', p.get('unit_price', 100.0))

        daily_demand = max(0.5, float(avg_daily_demand.get(pid, 15.0)))
        annual_demand = daily_demand * 365.0

        # EOQ Formula: sqrt((2 * Demand * SetupCost) / HoldingCost)
        order_cost = 150.0
        holding_cost = max(1.0, unit_cost * 0.20)
        eoq = int(np.round(np.sqrt((2 * annual_demand * order_cost) / holding_cost)))

        # Recommended Purchase Quantity (RPQ):
        demand_during_lead = daily_demand * (lead_time + 7)
        rpq_raw = demand_during_lead + safety_stock - stock
        rpq = int(max(eoq, np.ceil(rpq_raw / 10.0) * 10)) if stock <= rop else 0

        # Match suppliers by product_id if available, fallback to category or all
        cat_suppliers = pd.DataFrame()
        if not suppliers_df.empty:
            if 'product_id' in suppliers_df.columns:
                cat_suppliers = suppliers_df[suppliers_df['product_id'] == pid].copy()
            if cat_suppliers.empty and 'category' in suppliers_df.columns:
                cat_suppliers = suppliers_df[suppliers_df['category'] == pcategory].copy()
            if cat_suppliers.empty:
                cat_suppliers = suppliers_df.copy()

        ranked_suppliers = []
        if not cat_suppliers.empty:
            for _, s in cat_suppliers.iterrows():
                s_name = s.get('supplier_name', s.get('name', 'Supplier'))
                s_id = s.get('supplier_id', 'S000')
                s_lead = int(s.get('lead_time_days', lead_time))

                raw_rel = float(s.get('reliability_score', 90.0))
                rel_score = raw_rel if raw_rel <= 1.0 else (raw_rel / 100.0)

                raw_acc = float(s.get('order_accuracy', s.get('on_time_rate', 0.90)))
                on_time_acc = raw_acc if raw_acc <= 1.0 else (raw_acc / 100.0)

                est_unit_price = float(s.get('unit_price', unit_cost))
                price_ratio = est_unit_price / max(1.0, float(unit_cost))
                price_score = max(0.0, 100.0 - (price_ratio - 1.0) * 100.0)

                total_score = (
                    0.40 * (rel_score * 100.0) +
                    0.30 * (on_time_acc * 100.0) +
                    0.30 * price_score
                )

                rating = round(rel_score * 5.0, 1)
                est_total_price = round(est_unit_price * (rpq if rpq > 0 else eoq), 2)

                ranked_suppliers.append({
                    "supplier_id": s_id,
                    "name": s_name,
                    "rating": rating,
                    "total_score": round(total_score, 1),
                    "lead_time_days": s_lead,
                    "reliability_percent": round(rel_score * 100.0, 1),
                    "on_time_percent": round(on_time_acc * 100.0, 1),
                    "defect_rate_percent": round((1.0 - on_time_acc) * 100.0, 2),
                    "price_factor": round(price_ratio, 2),
                    "est_unit_price": round(est_unit_price, 2),
                    "est_total_price": est_total_price,
                    "recommendation_reason": f"Highest reliability ({round(rel_score * 100.0, 0):.0f}%) with {s_lead}-day lead time"
                })

            ranked_suppliers.sort(key=lambda x: x['total_score'], reverse=True)

        top_supplier = ranked_suppliers[0] if ranked_suppliers else None

        recommendations.append({
            "product_id": pid,
            "product_name": pname,
            "category": pcategory,
            "current_stock": int(stock),
            "reorder_point": int(rop),
            "safety_stock": int(safety_stock),
            "avg_daily_demand": round(daily_demand, 1),
            "eoq": eoq,
            "recommended_purchase_quantity": rpq,
            "reorder_needed": stock <= rop,
            "est_cost": round(rpq * unit_cost, 2) if rpq > 0 else 0.0,
            "top_supplier": top_supplier,
            "all_ranked_suppliers": ranked_suppliers
        })

    return recommendations

