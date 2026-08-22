import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePOModal: React.FC = () => {
  const {
    activePOModalProduct,
    setActivePOModalProduct,
    suppliers,
    createPurchaseOrder,
  } = useApp();

  const [quantity, setQuantity] = useState(1510);
  const [selectedSupplierCode, setSelectedSupplierCode] = useState('Supplier A (Apex Components)');
  const [targetWarehouse, setTargetWarehouse] = useState<'Pune' | 'Mumbai' | 'Delhi'>('Pune');
  const [urgency, setUrgency] = useState<'Standard' | 'Expedited'>('Standard');

  useEffect(() => {
    if (activePOModalProduct) {
      setQuantity(activePOModalProduct.recommendedPurchaseQty || 1510);
      setSelectedSupplierCode(activePOModalProduct.primarySupplier || 'Supplier A (Apex Components)');
      setTargetWarehouse(activePOModalProduct.warehouse);
    }
  }, [activePOModalProduct]);

  if (!activePOModalProduct) return null;

  const selectedSupplierObj = suppliers.find((s) => s.name === selectedSupplierCode) || suppliers[0];
  const unitPrice = selectedSupplierObj.unitPrice || activePOModalProduct.unitCost;
  const subtotal = quantity * unitPrice;
  const estimatedTaxAndFreight = Math.round(subtotal * 0.08);
  const totalPOAmount = subtotal + estimatedTaxAndFreight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPurchaseOrder(activePOModalProduct.name, selectedSupplierCode, quantity, targetWarehouse);
    setActivePOModalProduct(null);
  };

  return (
    <div
      id="create-po-backdrop"
      className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => setActivePOModalProduct(null)}
    >
      <div
        id="create-po-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E0E2DC] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAE6] flex items-center justify-between bg-[#FAF9F7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0F5B5C]/10 text-[#0F5B5C]">
                Smart Procurement
              </span>
              <span className="text-xs text-[#71746E] font-mono">PO-AUTO-DRAFT</span>
            </div>
            <h2 className="text-base font-bold text-[#1C1D1F] mt-1">
              Generate Purchase Order
            </h2>
          </div>
          <button
            onClick={() => setActivePOModalProduct(null)}
            className="p-1.5 text-[#888B84] hover:text-[#1C1D1F] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Product Summary Box */}
          <div className="p-3.5 bg-[#F6F6F2] rounded-lg border border-[#E4E5DF] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1C1D1F]">
                {activePOModalProduct.name}
              </p>
              <p className="text-[11px] text-[#71746E] mt-0.5">
                Current Stock: {activePOModalProduct.currentStock} units · Lead time: {activePOModalProduct.supplierLeadTimeDays} days
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#BE123C] bg-[#BE123C]/10 px-2 py-0.5 rounded-full">
                {activePOModalProduct.risk} Risk
              </span>
              <p className="text-[10px] text-[#71746E] mt-0.5">
                {activePOModalProduct.daysCover} days cover remaining
              </p>
            </div>
          </div>

          {/* Quantity & Warehouse */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4A4D46] mb-1">
                Order Quantity (Units)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-md border border-[#D5D7D2] focus:outline-hidden focus:border-[#0F5B5C] bg-white text-[#1C1D1F]"
                required
              />
              <p className="text-[10px] text-[#71746E] mt-1">
                Recommended: {activePOModalProduct.recommendedPurchaseQty} units
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4D46] mb-1">
                Destination Warehouse
              </label>
              <select
                value={targetWarehouse}
                onChange={(e) => setTargetWarehouse(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-md border border-[#D5D7D2] focus:outline-hidden focus:border-[#0F5B5C] bg-white text-[#1C1D1F]"
              >
                <option value="Pune">Pune Hub (Primary Stockout Risk)</option>
                <option value="Mumbai">Mumbai Regional DC</option>
                <option value="Delhi">Delhi North DC</option>
              </select>
            </div>
          </div>

          {/* Supplier Selection */}
          <div>
            <label className="block text-xs font-medium text-[#4A4D46] mb-1">
              Select Supplier Vendor
            </label>
            <div className="space-y-1.5">
              {suppliers.map((sup) => (
                <label
                  key={sup.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedSupplierCode === sup.name
                      ? 'border-[#0F5B5C] bg-[#0F5B5C]/5'
                      : 'border-[#E0E2DC] hover:bg-[#F9F9F7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="supplier"
                      checked={selectedSupplierCode === sup.name}
                      onChange={() => setSelectedSupplierCode(sup.name)}
                      className="text-[#0F5B5C] focus:ring-[#0F5B5C]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#1C1D1F] flex items-center gap-1.5">
                        {sup.name}
                        {sup.status === 'Recommended' && (
                          <span className="text-[9px] bg-[#0F5B5C] text-white px-1.5 py-0.2 rounded font-medium">
                            Ranked #1
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#71746E]">
                        Lead Time: {sup.leadTimeDays}d · Reliability: {sup.reliabilityRate}% · Accuracy: {sup.orderAccuracyRate}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-[#1C1D1F]">
                      ₹{sup.unitPrice.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#888B84]">per unit</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-3 bg-[#FAF9F7] rounded-lg border border-[#EAEAE6] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#71746E]">
              <span>Base Cost ({quantity.toLocaleString()} × ₹{unitPrice}):</span>
              <span className="font-mono text-[#1C1D1F]">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#71746E]">
              <span>Freight, Insurance & Handling:</span>
              <span className="font-mono text-[#1C1D1F]">₹{estimatedTaxAndFreight.toLocaleString()}</span>
            </div>
            <div className="pt-1.5 border-t border-[#E5E6E0] flex justify-between font-semibold text-sm text-[#1C1D1F]">
              <span>Total Purchase Commitment:</span>
              <span className="font-mono text-[#0F5B5C]">₹{totalPOAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActivePOModalProduct(null)}
              className="px-4 py-2 text-xs font-medium text-[#555850] hover:text-[#1C1D1F] transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-dispatch-po-btn"
              type="submit"
              className="px-4 py-2 bg-[#0F5B5C] hover:bg-[#0c4a4b] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve & Dispatch PO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
