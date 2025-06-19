import React, { useState } from 'react';
import { Edit2, Trash2, Filter, Download, Search, Calendar, Truck, User, MapPin, X } from 'lucide-react';
import type { LogisticsEntry } from '../types';
import { formatDate, getMonthOptions } from '../utils/dateUtils';
import { deleteEntry } from '../utils/storage';

interface EntriesTableProps {
  entries: LogisticsEntry[];
  onEntriesChange: () => void;
}

export const EntriesTable: React.FC<EntriesTableProps> = ({ entries, onEntriesChange }) => {
  const [filters, setFilters] = useState({
    month: '',
    vehicleNo: '',
    driverName: '',
    from: '',
    to: '',
    particular: '',
    chalanNo: '',
    minAmount: '',
    maxAmount: '',
    minQuantity: '',
    maxQuantity: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const monthOptions = getMonthOptions();

  const filteredEntries = entries.filter(entry => {
    const entryMonth = entry.date.slice(0, 7); // YYYY-MM format
    
    if (filters.month && entryMonth !== filters.month) return false;
    if (filters.vehicleNo && !entry.vehicleNo.toLowerCase().includes(filters.vehicleNo.toLowerCase())) return false;
    if (filters.driverName && !entry.driverName.toLowerCase().includes(filters.driverName.toLowerCase())) return false;
    if (filters.from && !entry.from.toLowerCase().includes(filters.from.toLowerCase())) return false;
    if (filters.to && !entry.to.toLowerCase().includes(filters.to.toLowerCase())) return false;
    if (filters.particular && !entry.particular.toLowerCase().includes(filters.particular.toLowerCase())) return false;
    if (filters.chalanNo && !entry.chalanNo.toLowerCase().includes(filters.chalanNo.toLowerCase())) return false;
    
    // Amount filters
    if (filters.minAmount && (entry.amount || 0) < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && (entry.amount || 0) > parseFloat(filters.maxAmount)) return false;
    
    // Quantity filters
    if (filters.minQuantity && entry.quantity < parseFloat(filters.minQuantity)) return false;
    if (filters.maxQuantity && entry.quantity > parseFloat(filters.maxQuantity)) return false;
    
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      onEntriesChange();
    }
  };

  const clearAllFilters = () => {
    setFilters({
      month: '',
      vehicleNo: '',
      driverName: '',
      from: '',
      to: '',
      particular: '',
      chalanNo: '',
      minAmount: '',
      maxAmount: '',
      minQuantity: '',
      maxQuantity: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['SR. NO.', 'Date', 'Particular', 'Chalan No.', 'Vehicle No.', 'Driver Name', 'From', 'To', 'Quantity', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.srNo,
        formatDate(entry.date),
        `"${entry.particular}"`,
        entry.chalanNo,
        entry.vehicleNo,
        `"${entry.driverName}"`,
        `"${entry.from}"`,
        `"${entry.to}"`,
        entry.quantity,
        entry.amount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logistics-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mr-3">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Entries ({filteredEntries.length})
            </h2>
            {activeFiltersCount > 0 && (
              <span className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                showAdvancedFilters 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <Filter className="h-5 w-5 mr-2" />
              {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <X className="h-5 w-5 mr-2" />
                Clear All
              </button>
            )}
            
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Months</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by Vehicle No."
              value={filters.vehicleNo}
              onChange={(e) => setFilters(prev => ({ ...prev, vehicleNo: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by Driver Name"
              value={filters.driverName}
              onChange={(e) => setFilters(prev => ({ ...prev, driverName: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by Particular"
              value={filters.particular}
              onChange={(e) => setFilters(prev => ({ ...prev, particular: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {showAdvancedFilters && (
          <div className="bg-gray-700/30 rounded-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-purple-400" />
              Advanced Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by From Location"
                  value={filters.from}
                  onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by To Location"
                  value={filters.to}
                  onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by Chalan No."
                  value={filters.chalanNo}
                  onChange={(e) => setFilters(prev => ({ ...prev, chalanNo: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Amount Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Amount (₹)</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minQuantity}
                  onChange={(e) => setFilters(prev => ({ ...prev, minQuantity: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Quantity</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.maxQuantity}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxQuantity: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SR. NO.</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Particular</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Chalan No.</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehicle No.</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Route</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-500 mb-4" />
                    <p className="text-lg">No entries found matching the current filters.</p>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                      {entry.srNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                    <div className="truncate" title={entry.particular}>
                      {entry.particular}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {entry.chalanNo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white bg-gray-700/30 rounded">
                    {entry.vehicleNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {entry.driverName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="flex items-center">
                      <span className="truncate max-w-20 px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                        {entry.from}
                      </span>
                      <span className="mx-2 text-gray-500">→</span>
                      <span className="truncate max-w-20 px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                        {entry.to}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                      {entry.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {entry.amount ? (
                      <span className="font-semibold text-green-400">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};