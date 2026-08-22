from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(String(50), primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), index=True, nullable=False)
    unit_cost = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    lead_time_days = Column(Integer, nullable=False)
    safety_stock = Column(Integer, nullable=False)
    reorder_point = Column(Integer, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    # Relationships
    suppliers = relationship("Supplier", back_populates="product", cascade="all, delete-orphan")
    sales = relationship("Sales", back_populates="product", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="product", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="product", cascade="all, delete-orphan")
    forecasts = relationship("Forecast", back_populates="product", cascade="all, delete-orphan")
    risk_events = relationship("RiskEvent", back_populates="product", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="product", cascade="all, delete-orphan")


class Supplier(Base):
    __tablename__ = "suppliers"

    supplier_id = Column(String(50), primary_key=True, index=True)
    supplier_name = Column(String(255), nullable=False)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    unit_price = Column(Float, nullable=False)
    lead_time_days = Column(Integer, nullable=False)
    reliability_score = Column(Float, nullable=False)
    order_accuracy = Column(Float, nullable=False)
    minimum_order_qty = Column(Integer, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="suppliers")
    orders = relationship("Order", back_populates="supplier")
    recommendations = relationship("Recommendation", back_populates="supplier")


class Sales(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    sale_date = Column(Date, index=True, nullable=False)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    units_sold = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    promotion = Column(Boolean, default=False, nullable=False)
    discount_pct = Column(Float, default=0.0, nullable=False)
    sales_channel = Column(String(50), nullable=False)

    # Relationships
    product = relationship("Product", back_populates="sales")


class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    snapshot_date = Column(Date, index=True, nullable=False)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    opening_stock = Column(Integer, nullable=False)
    units_received = Column(Integer, nullable=False)
    units_sold = Column(Integer, nullable=False)
    closing_stock = Column(Integer, nullable=False)
    reserved_stock = Column(Integer, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="inventory")


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String(50), primary_key=True, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    supplier_id = Column(String(50), ForeignKey("suppliers.supplier_id"), index=True, nullable=False)
    order_date = Column(Date, index=True, nullable=False)
    quantity = Column(Integer, nullable=False)
    expected_delivery = Column(Date, nullable=False)
    actual_delivery = Column(Date, nullable=True)
    status = Column(String(50), index=True, nullable=False)
    unit_price = Column(Float, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="orders")
    supplier = relationship("Supplier", back_populates="orders")


class Forecast(Base):
    __tablename__ = "forecasts"

    forecast_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    forecast_date = Column(Date, index=True, nullable=False)
    target_date = Column(Date, index=True, nullable=False)
    predicted_demand = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=False)
    upper_bound = Column(Float, nullable=False)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)

    # Relationships
    product = relationship("Product", back_populates="forecasts")


class RiskEvent(Base):
    __tablename__ = "risk_events"

    risk_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    evaluation_date = Column(Date, index=True, nullable=False)
    current_stock = Column(Integer, nullable=False)
    forecast_demand_7d = Column(Float, nullable=False)
    risk_level = Column(String(50), index=True, nullable=False)
    days_to_stockout = Column(Float, nullable=False)
    reason = Column(Text, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="risk_events")


class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id"), index=True, nullable=False)
    recommendation_date = Column(Date, index=True, nullable=False)
    risk_level = Column(String(50), nullable=False)
    recommended_action = Column(String(100), nullable=False)
    recommended_quantity = Column(Integer, nullable=False)
    supplier_id = Column(String(50), ForeignKey("suppliers.supplier_id"), index=True, nullable=False)
    supplier_score = Column(Float, nullable=False)
    estimated_unit_cost = Column(Float, nullable=False)
    estimated_purchase_value = Column(Float, nullable=False)
    rationale = Column(Text, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="recommendations")
    supplier = relationship("Supplier", back_populates="recommendations")
