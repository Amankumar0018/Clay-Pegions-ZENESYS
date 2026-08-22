# NEXUS AI Synthetic Dataset

Domain: Demand Forecasting & Order Fulfillment

Generated for the NEXUS AI hackathon MVP.

## Files
- products.csv — product master
- suppliers.csv — supplier/product relationships and supplier performance
- sales.csv — historical sales transactions (~12K rows)
- sales_ml_ready.csv — cleaned sales data with forecasting features
- inventory.csv — historical inventory snapshots
- orders.csv — purchase/fulfillment orders with delayed/in-transit scenarios
- forecasts.csv — 14-day synthetic forecast outputs for dashboard/API testing
- risk_events.csv — inventory risk classifications
- recommendations.csv — replenishment and supplier recommendations

## Important
This is synthetic/demo data. It must not be presented as real enterprise data or real-world model performance.

## Intended pipeline
Sales -> Forecast -> Inventory Risk -> Purchase Recommendation -> Supplier Ranking -> Order -> Fulfillment Alert
