import pandas as pd
import numpy as np

def calculate_inventory_risks(products_df, sales_df):
    """
    Evaluates current inventory against predicted average daily demand,
    reorder points, and safety stock.
    Categorizes risk levels:
    - High Stockout Risk (Current stock < Safety Stock or Days to Stockout < Lead Time)
    - Medium Stockout Risk (Current Stock < Reorder Point)
    - Overstock Risk (Current Stock > 4x Reorder Point)
    - Low Risk / Healthy
    """
    risks = []

    # Calculate average daily sales over last 30 days per product
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

        daily_demand = avg_daily_demand.get(pid, 15.0)
        daily_demand = max(0.5, float(daily_demand))

        days_of_supply = round(stock / daily_demand, 1)
        days_to_stockout = max(0, round(stock / daily_demand, 1))

        # Risk Classification
        if stock <= safety_stock or days_to_stockout <= lead_time:
            risk_level = "High"
            risk_type = "Critical Stockout Risk"
            urgency = "Immediate Action Required"
            badge_color = "red"
            description = f"Current stock ({stock} units) is below safety stock threshold ({safety_stock} units). Stockout expected in {days_to_stockout} days, while supplier lead time is {lead_time} days."
        elif stock <= rop:
            risk_level = "Medium"
            risk_type = "Reorder Threshold Reached"
            urgency = "Action Recommended"
            badge_color = "amber"
            description = f"Current stock ({stock} units) is below reorder point ({rop} units). Reorder recommended within {int(days_to_stockout - lead_time)} days."
        elif stock >= (rop * 4):
            risk_level = "Medium"
            risk_type = "Excess Overstock"
            urgency = "Optimization Suggested"
            badge_color = "blue"
            description = f"Current stock ({stock} units) exceeds 4x reorder point ({rop * 4} units). Capital tied up in excess inventory: ${round(stock * p['unit_cost'], 2):,}."
        else:
            risk_level = "Low"
            risk_type = "Healthy Inventory"
            urgency = "Normal Monitoring"
            badge_color = "emerald"
            description = f"Inventory level is optimal with {days_of_supply} days of supply remaining."

        risks.append({
            "product_id": pid,
            "product_name": p['name'],
            "category": p['category'],
            "current_stock": int(stock),
            "safety_stock": int(safety_stock),
            "reorder_point": int(rop),
            "lead_time_days": int(lead_time),
            "avg_daily_demand": round(daily_demand, 1),
            "days_of_supply": days_of_supply,
            "days_to_stockout": days_to_stockout,
            "risk_level": risk_level,
            "risk_type": risk_type,
            "urgency": urgency,
            "badge_color": badge_color,
            "description": description,
            "unit_cost": float(p['unit_cost']),
            "unit_price": float(p['unit_price'])
        })

    return risks
