import re
from datetime import datetime

def process_ai_query(user_query, products_df, suppliers_df, sales_df, orders_df, risks_data, reco_data):
    """
    Grounded NLP engine for operational business questions.
    Analyzes intent and fetches real-time application context before responding.
    """
    query_lower = user_query.lower()

    # Intent 1: Risk / Stockout Query
    if any(w in query_lower for w in ["stockout", "risk", "shortage", "run out", "inventory risk"]):
        high_risks = [r for r in risks_data if r['risk_level'] == 'High']
        medium_risks = [r for r in risks_data if r['risk_level'] == 'Medium']

        if high_risks:
            items_str = ", ".join([f"**{r['product_name']}** ({r['current_stock']} units left, {r['days_to_stockout']} days supply)" for r in high_risks])
            response_text = (
                f"🚨 **Attention Required:** There are **{len(high_risks)} products at HIGH stockout risk**:\n\n"
                f"{items_str}.\n\n"
                f"We recommend issuing immediate purchase orders to avoid supply disruption. "
                f"Check the **Smart Procurement** panel to approve pre-calculated purchase orders."
            )
            data_card = {
                "title": "High Risk Inventory Summary",
                "items": [{"name": r['product_name'], "stock": r['current_stock'], "days_left": r['days_to_stockout'], "urgency": r['urgency']} for r in high_risks],
                "action_tab": "procurement"
            }
        else:
            response_text = f"✅ **All inventory levels are stable!** There are currently no high-risk stockouts detected across {len(products_df)} products."
            data_card = None

        return {
            "answer": response_text,
            "data_card": data_card,
            "suggested_actions": ["Review Recommended Purchase Orders", "Simulate 50% Demand Surge"]
        }

    # Intent 2: Purchasing / Reorder / Procurement Query
    if any(w in query_lower for w in ["purchase", "buy", "reorder", "order quantity", "procurement", "what should we purchase"]):
        reorders = [r for r in reco_data if r['reorder_needed']]
        if reorders:
            summary_list = []
            total_est_spend = 0.0
            for r in reorders:
                qty = r['recommended_purchase_quantity']
                supplier_name = r['top_supplier']['name'] if r['top_supplier'] else "Default Vendor"
                est_cost = r['est_cost']
                total_est_spend += est_cost
                summary_list.append(f"• **{r['product_name']}**: Reorder **{qty} units** via *{supplier_name}* (Est. Cost: ${est_cost:,.2f})")

            response_text = (
                f"🛒 **NEXUS AI Procurement Recommendation:**\n\n"
                f"Based on current lead times, safety stock calculations, and predicted demand, you should place **{len(reorders)} purchase orders** totaling **${total_est_spend:,.2f}**:\n\n"
                + "\n".join(summary_list)
            )
            data_card = {
                "title": "Pending Procurement Plan",
                "total_spend": round(total_est_spend, 2),
                "order_count": len(reorders),
                "action_tab": "procurement"
            }
        else:
            response_text = "✅ No immediate purchase orders are required today based on current stock levels and lead time buffers."
            data_card = None

        return {
            "answer": response_text,
            "data_card": data_card,
            "suggested_actions": ["View Supplier Scorecards", "Run Demand Forecast Simulation"]
        }

    # Intent 3: Order / Shipment Tracking Query
    if any(w in query_lower for w in ["delayed", "shipment", "order status", "tracking", "fulfillment", "where is my order"]):
        delayed_orders = orders_df[orders_df['delayed_flag'] == True]
        active_orders = orders_df[orders_df['status'] != 'Delivered']

        if not delayed_orders.empty:
            d_list = []
            for _, o in delayed_orders.iterrows():
                d_list.append(f"⚠️ Order **{o['order_id']}** ({o['product_name']}) — Carrier: *{o['carrier']}*, Tracking: `{o['tracking_number']}`. Reason: *{o['delay_reason']}*.")

            response_text = (
                f"🚚 **Fulfillment Alert:** Found **{len(delayed_orders)} delayed shipment(s)**:\n\n"
                + "\n".join(d_list) + "\n\n"
                f"Active open orders in pipeline: **{len(active_orders)}**."
            )
            data_card = {
                "title": "Fulfillment Exception Tracking",
                "delayed_count": len(delayed_orders),
                "active_count": len(active_orders),
                "action_tab": "fulfillment"
            }
        else:
            response_text = f"🚚 All **{len(active_orders)} active orders** are currently on schedule for expected delivery!"
            data_card = None

        return {
            "answer": response_text,
            "data_card": data_card,
            "suggested_actions": ["View Order Fulfillment Timeline", "Contact Supplier"]
        }

    # Intent 4: Supplier Recommendation Query
    if any(w in query_lower for w in ["supplier", "vendor", "best supplier", "who should we buy from"]):
        best_suppliers = suppliers_df.sort_values(by="reliability_score", ascending=False)
        top_s = best_suppliers.iloc[0]
        response_text = (
            f"🏆 **Top Supplier Recommendation:**\n\n"
            f"**{top_s['name']}** is ranked #1 with a **{round(top_s['reliability_score']*100, 1)}% reliability score**, "
            f"**{top_s['lead_time_days']}-day lead time**, and an on-time delivery rate of **{round(top_s['on_time_rate']*100, 1)}%**.\n\n"
            f"All suppliers are ranked using a multi-criteria weighted matrix balancing Price (25%), Reliability (35%), On-time delivery (20%), and Defect Rate (20%)."
        )
        return {
            "answer": response_text,
            "data_card": {
                "title": "Top Ranked Supplier",
                "supplier": top_s['name'],
                "rating": top_s['rating'],
                "lead_time": f"{top_s['lead_time_days']} days",
                "action_tab": "procurement"
            },
            "suggested_actions": ["Compare All Suppliers", "Check Lead Time Risks"]
        }

    # Fallback / General Query
    response_text = (
        f"🤖 **NEXUS AI Decision Support System**\n\n"
        f"I am actively monitoring **{len(products_df)} products**, **{len(suppliers_df)} suppliers**, and **{len(orders_df)} active orders**.\n\n"
        f"You can ask me questions such as:\n"
        f"• *\"Which products are at risk of stockout?\"*\n"
        f"• *\"What should we purchase this week?\"*\n"
        f"• *\"Which orders are delayed?\"*\n"
        f"• *\"Which supplier is best for Electronics?\"*"
    )
    return {
        "answer": response_text,
        "data_card": None,
        "suggested_actions": ["Which products are at risk?", "What should we purchase?", "Which orders are delayed?"]
    }
