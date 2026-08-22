import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem, OrderStatus } from '../types';

export const OrdersScreen: React.FC = () => {
  const {
    orders,
    selectedWarehouse,
    setActiveOrderDetail,
    setActivePOModalProduct,
    products,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesWarehouse =
      selectedWarehouse === 'All' || o.warehouse === selectedWarehouse;
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.carrier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWarehouse && matchesStatus && matchesSearch;
  });

  const statuses: (OrderStatus | 'All')[] = [
    'All',
    'In Transit',
    'Delayed',
    'Processing',
    'Created',
    'Delivered',
  ];

  return (
    <div id="orders-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#EAEAE6]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1C1D1F]">
            Orders
          </h1>
          <p className="text-xs md:text-sm text-[#71746E] mt-1">
            Track every order from request to delivery.
          </p>
        </div>

        <button
          onClick={() => setActivePOModalProduct(products[0])}
          className="px-3.5 py-1.5 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E0E2DC]">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#888B84]" />
          <input
            type="text"
            placeholder="Search by order ID, SKU, supplier or tracking #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none text-[#1C1D1F] placeholder:text-[#888B84] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-[#71746E]">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                statusFilter === st
                  ? 'bg-[#1C1D1F] text-white'
                  : 'bg-[#F4F4F1] text-[#555850] hover:bg-[#EAEAE6]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E0E2DC] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F8F5] border-b border-[#EAEAE6] text-[#71746E] font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB]">
              {filteredOrders.map((ord) => {
                const getStatusClass = (status: OrderStatus) => {
                  switch (status) {
                    case 'Delayed':
                      return 'bg-[#BE123C]/10 text-[#BE123C] border-[#BE123C]/20';
                    case 'In Transit':
                      return 'bg-[#0F5B5C]/10 text-[#0F5B5C] border-[#0F5B5C]/20';
                    case 'Delivered':
                      return 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20';
                    case 'Processing':
                      return 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20';
                    case 'Created':
                    default:
                      return 'bg-[#EDEDE8] text-[#555] border-[#D5D7D2]';
                  }
                };

                return (
                  <tr
                    key={ord.id}
                    id={`order-row-${ord.id}`}
                    onClick={() => setActiveOrderDetail(ord)}
                    className="hover:bg-[#FAF9F7] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1D1F]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1C1D1F]">
                      {ord.productName}
                    </td>
                    <td className="py-3 px-4 text-[#555850]">
                      {ord.supplierName}
                    </td>
                    <td className="py-3 px-4 text-[#555850]">
                      <span className="px-2 py-0.5 rounded bg-[#F4F4F1] text-[11px] font-medium">
                        {ord.warehouse}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#1C1D1F]">
                      {ord.quantity} units
                    </td>
                    <td className="py-3 px-4 text-[#71746E]">
                      {ord.createdDate}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1C1D1F]">
                      {ord.expectedDelivery}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusClass(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-medium ${
                          ord.risk === 'High'
                            ? 'text-[#BE123C] font-semibold'
                            : ord.risk === 'Medium'
                            ? 'text-[#B45309]'
                            : 'text-[#71746E]'
                        }`}
                      >
                        {ord.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrderDetail(ord);
                        }}
                        className="px-2.5 py-1 text-xs text-[#0F5B5C] hover:bg-[#0F5B5C]/10 rounded font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
