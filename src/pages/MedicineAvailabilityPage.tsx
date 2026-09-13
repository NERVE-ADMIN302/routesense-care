import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  Minus,
  Edit3,
  X,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useHealthcare } from '../context/HealthcareContext';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Facility, FacilityMedicineItem } from '../data/facilityData';

export const MedicineAvailabilityPage: React.FC = () => {
  const { facilities, updateFacilityMedicineStock } = useHealthcare();
  const { showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [editingMed, setEditingMed] = useState<{
    facilityId: string;
    facilityName: string;
    medicineName: string;
    stock: number;
    status: 'Available' | 'Limited' | 'Stockout';
  } | null>(null);

  // Flatten medicines across facilities for matrix view or facility-specific view
  const allMedicineRecords: {
    facilityId: string;
    facilityName: string;
    facilityType: string;
    medicine: FacilityMedicineItem;
  }[] = [];

  facilities.forEach((fac) => {
    fac.medicines?.forEach((med) => {
      allMedicineRecords.push({
        facilityId: fac.id,
        facilityName: fac.name,
        facilityType: fac.type,
        medicine: med,
      });
    });
  });

  // Calculate dynamic metrics
  const totalTracked = allMedicineRecords.length;
  const stockoutCount = allMedicineRecords.filter((r) => r.medicine.status === 'Stockout' || r.medicine.stock === 0).length;
  const lowStockCount = allMedicineRecords.filter((r) => r.medicine.status === 'Limited').length;
  const availableCount = allMedicineRecords.filter((r) => r.medicine.status === 'Available').length;

  const filteredRecords = allMedicineRecords.filter((r) => {
    const matchesSearch =
      r.medicine.name.toLowerCase().includes(search.toLowerCase()) ||
      r.facilityName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || r.medicine.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesFacility =
      selectedFacilityId === 'all' || r.facilityId === selectedFacilityId;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  const handleQuickAdjust = (
    facilityId: string,
    medicineName: string,
    currentStock: number,
    delta: number
  ) => {
    const newStock = Math.max(0, currentStock + delta);
    const newStatus: 'Available' | 'Limited' | 'Stockout' =
      newStock === 0 ? 'Stockout' : newStock < 25 ? 'Limited' : 'Available';
    updateFacilityMedicineStock(facilityId, medicineName, newStock, newStatus);
    showToast(`Adjusted ${medicineName} stock to ${newStock} units`, 'info');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMed) {
      updateFacilityMedicineStock(
        editingMed.facilityId,
        editingMed.medicineName,
        editingMed.stock,
        editingMed.status
      );
      showToast(`Updated stock record for ${editingMed.medicineName}`, 'success');
      setEditingMed(null);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 shadow-2xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Medicine Availability Matrix
                </h1>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Live Network
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time essential drug stock tracking & buffer management across primary, secondary, and tertiary nodes
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => showToast('Stock verified with Tamil Nadu Medical Services Corporation (TNMSC) buffer ledger', 'success')}
          className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto cursor-pointer btn-lift"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync TNMSC Depot</span>
        </button>
      </div>

      {/* Dynamic Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Stock Lines</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalTracked}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {facilities.length} network facilities</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-800">Adequate Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{availableCount}</div>
          <p className="text-[11px] text-emerald-700 mt-0.5">&gt; 25 units buffer reserve</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-800">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{lowStockCount}</div>
          <p className="text-[11px] text-amber-700 mt-0.5">Requires replenishment request</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-800">Stockouts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{stockoutCount}</div>
          <p className="text-[11px] text-rose-700 mt-0.5">Immediate inter-facility diversion</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs hover-lift">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine name, formulation, facility..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
          <span className="text-slate-400">Facility:</span>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium cursor-pointer"
          >
            <option value="all">All Facilities ({facilities.length})</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.shortName || f.name}
              </option>
            ))}
          </select>

          <span className="text-slate-400 ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="stockout">Stockout</option>
          </select>
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs overflow-x-auto hover-lift animate-fade-in-up delay-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-3 px-3">Medicine & Formulation</th>
              <th className="py-3 px-3">Facility Location</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Available Quantity</th>
              <th className="py-3 px-3 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((item, idx) => (
                <tr key={`${item.facilityId}-${item.medicine.name}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 text-sm">{item.medicine.name}</div>
                    <span className="text-[10px] text-slate-400">Essential Drug List (EDL) • Essential</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{item.facilityName}</div>
                    <span className="text-[10px] text-slate-400">{item.facilityType} Tier</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={item.medicine.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-sm text-slate-800">
                    {item.medicine.stock} <span className="text-xs font-normal text-slate-400">units</span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.facilityId, item.medicine.name, item.medicine.stock, -10)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Reduce 10 units"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.facilityId, item.medicine.name, item.medicine.stock, 10)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Add 10 units"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingMed({
                            facilityId: item.facilityId,
                            facilityName: item.facilityName,
                            medicineName: item.medicine.name,
                            stock: item.medicine.stock,
                            status: item.medicine.status,
                          })
                        }
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 ml-1 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No medicine inventory records found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Medicine Stock Modal */}
      {editingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Stock Level</h3>
                <span className="text-xs text-slate-500">{editingMed.facilityName}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingMed(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={editingMed.medicineName}
                  disabled
                  className="w-full p-2.5 rounded-2xl border bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={editingMed.stock}
                    onChange={(e) =>
                      setEditingMed({
                        ...editingMed,
                        stock: Number(e.target.value),
                        status:
                          Number(e.target.value) === 0
                            ? 'Stockout'
                            : Number(e.target.value) < 25
                            ? 'Limited'
                            : 'Available',
                      })
                    }
                    className="w-full p-2.5 rounded-2xl border font-mono font-bold text-sm focus:border-blue-600 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={editingMed.status}
                    onChange={(e) =>
                      setEditingMed({
                        ...editingMed,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-2xl border font-bold focus:border-blue-600 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited / Low Stock</option>
                    <option value="Stockout">Stockout</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="px-4 py-2 border rounded-full font-bold hover:bg-slate-50 transition-colors btn-lift cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors btn-lift cursor-pointer"
                >
                  Save Stock Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

