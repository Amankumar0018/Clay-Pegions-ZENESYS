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
    if not recent_sales.empty and 'date' in recent_sales.columns:
        recent_sales['date'] = pd.to_datetime(recent_sales['date'])
        max_date = recent_sales['date'].max()
        cutoff = max_date - pd.Timedelta(days=30)
        recent_30 = recent_sales[recent_sales['date'] >= cutoff]
        avg_daily_demand = recent_30.groupby('product_id')['quantity_sold'].mean().to_dict()
    else:
        avg_daily_demand = {}

    for _, p in products_df.iterrows():
        pid = p['product_id']
        stock = p['current_stock']
        safety_stock = p['safety_stock']
        rop = p['reorder_point']
        lead_time = p['lead_time_days']
        unit_cost = p['unit_cost']

        daily_demand = max(0.5, float(avg_daily_demand.get(pid, 15.0)))
        annual_demand = daily_demand * 365.0

        # EOQ Formula: sqrt((2 * Demand * SetupCost) / HoldingCost)
        # Assuming fixed setup cost S = $150 per PO, holding cost H = 20% of unit cost per year
        order_cost = 150.0
        holding_cost = max(1.0, unit_cost * 0.20)
        eoq = int(np.round(np.sqrt((2 * annual_demand * order_cost) / holding_cost)))

        # Recommended Purchase Quantity (RPQ):
        # Forecast Demand over Lead Time + Safety Stock - Current Stock
        demand_during_lead = daily_demand * (lead_time + 7) # cover lead time + 7 day buffer
        rpq_raw = demand_during_lead + safety_stock - stock
        rpq = int(max(eoq, np.ceil(rpq_raw / 10.0) * 10)) if stock <= rop else 0

        # Supplier Scoring & Ranking for this Product Category
        cat_suppliers = suppliers_df[suppliers_df['category'] == p['category']].copy()
        if cat_suppliers.empty:
            cat_suppliers = suppliers_df.copy() # fallback

        ranked_suppliers = []
        for _, s in cat_suppliers.iterrows():
            # Multi-attribute utility score (0 - 100)
            # Weights: Reliability (35%), Price (25%), On-time (20%), Quality/Low Defect (20%)
            price_score = max(0, 100 - (s['price_factor'] - 1.0) * 100)
            reliability_score = s['reliability_score'] * 100
            on_time_score = s['on_time_rate'] * 100
            quality_score = (1.0 - s['defect_rate']) * 100

            total_score = (
                0.35 * reliability_score +
                0.25 * price_score +
                0.20 * on_time_score +
                0.20 * quality_score
            )

            est_unit_price = round(unit_cost * s['price_factor'], 2)
            est_total_price = round(est_unit_price * (rpq if rpq > 0 else eoq), 2)

            ranked_suppliers.append({
                "supplier_id": s['supplier_id'],
                "name": s['name'],
                "rating": float(s['rating']),
                "total_score": round(total_score, 1),
                "lead_time_days": int(s['lead_time_days']),
                "reliability_percent": round(s['reliability_score'] * 100, 1),
                "on_time_percent": round(s['on_time_rate'] * 100, 1),
                "defect_rate_percent": round(s['defect_rate'] * 100, 2),
                "price_factor": float(s['price_factor']),
                "est_unit_price": est_unit_price,
                "est_total_price": est_total_price,
                "recommendation_reason": f"Highest reliability ({round(s['reliability_score']*100, 0)}%) with {s['lead_time_days']}-day lead time"
            })

        # Sort suppliers descending by total_score
        ranked_suppliers.sort(key=lambda x: x['total_score'], reverse=True)
        top_supplier = ranked_suppliers[0] if ranked_suppliers else None

        recommendations.append({
            "product_id": pid,
            "product_name": p['name'],
            "category": p['category'],
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
