import React, { useState } from 'react';
import { BarChart3, TrendingUp, Truck, Users, Calendar, IndianRupee, Zap, Target, Filter, X } from 'lucide-react';
import type { LogisticsEntry } from '../types';
import { getMonthYear, getMonthOptions } from '../utils/dateUtils';

interface DashboardProps {
  entries: LogisticsEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const monthOptions = getMonthOptions();
  
  // Filter entries based on selected month
  const filteredEntries = selectedMonth 
    ? entries.filter(entry => entry.date.startsWith(selectedMonth))
    : entries;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthEntries = entries.filter(entry => entry.date.startsWith(currentMonth));
  
  //const totalQuantity = filteredEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = filteredEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  
  //const currentMonthQuantity = currentMonthEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const currentMonthAmount = currentMonthEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  
  const uniqueVehicles = new Set(filteredEntries.map(entry => entry.vehicleNo)).size;
  const uniqueDrivers = new Set(filteredEntries.map(entry => entry.driverName)).size;

  // Monthly breakdown for the last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7);
    const monthEntries = entries.filter(entry => entry.date.startsWith(monthKey));
    
    monthlyData.push({
      month: getMonthYear(date.toISOString()),
      entries: monthEntries.length,
      quantity: monthEntries.reduce((sum, entry) => sum + entry.quantity, 0),
      amount: monthEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
    });
  }

  const clearFilter = () => {
    setSelectedMonth('');
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    gradient: string;
    iconBg: string;
  }> = ({ title, value, subtitle, icon, gradient, iconBg }) => (
    <div className="group relative bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-2xl ${iconBg} shadow-lg`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg mr-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          {selectedMonth && (
            <span className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              Filtered by {monthOptions.find(m => m.value === selectedMonth)?.label}
            </span>
          )}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Time</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {selectedMonth && (
            <button
              onClick={clearFilter}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={selectedMonth ? "Filtered Entries" : "Total Entries"}
          value={filteredEntries.length}
          subtitle={selectedMonth ? "Selected month" : "All time"}
          icon={<Calendar className="h-6 w-6 text-white" />}
          gradient="from-blue-500 to-cyan-500"
          iconBg="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatCard
          title="This Month"
          value={currentMonthEntries.length}
          subtitle="Current month entries"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          gradient="from-green-500 to-emerald-500"
          iconBg="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatCard
          title={selectedMonth ? "Filtered Vehicles" : "Active Vehicles"}
          value={uniqueVehicles}
          subtitle="Unique vehicles"
          icon={<Truck className="h-6 w-6 text-white" />}
          gradient="from-purple-500 to-violet-500"
          iconBg="bg-gradient-to-r from-purple-500 to-violet-500"
        />
        <StatCard
          title={selectedMonth ? "Filtered Drivers" : "Drivers"}
          value={uniqueDrivers}
          subtitle="Unique drivers"
          icon={<Users className="h-6 w-6 text-white" />}
          gradient="from-orange-500 to-red-500"
          iconBg="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title={selectedMonth ? "Filtered Revenue" : "Total Revenue"}
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          subtitle={selectedMonth ? "Selected period" : "All time revenue"}
          icon={<IndianRupee className="h-6 w-6 text-white" />}
          gradient="from-emerald-500 to-teal-500"
          iconBg="bg-gradient-to-r from-emerald-500 to-teal-500"
        />
        <StatCard
          title="This Month Revenue"
          value={`₹${currentMonthAmount.toLocaleString('en-IN')}`}
          subtitle="Current month revenue"
          icon={<Zap className="h-6 w-6 text-white" />}
          gradient="from-yellow-500 to-orange-500"
          iconBg="bg-gradient-to-r from-yellow-500 to-orange-500"
        />
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Monthly Performance (Last 6 Months)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 font-medium text-gray-300">Month</th>
                <th className="text-left py-4 px-4 font-medium text-gray-300">Entries</th>
                <th className="text-left py-4 px-4 font-medium text-gray-300">Total Quantity</th>
                <th className="text-left py-4 px-4 font-medium text-gray-300">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="py-4 px-4 font-medium text-white">{month.month}</td>
                  <td className="py-4 px-4 text-gray-300">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {month.entries}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{month.quantity.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-300">
                    <span className="font-semibold text-green-400">
                      ₹{month.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Vehicles and Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-blue-400" />
            Top Vehicles by Usage {selectedMonth && '(Filtered)'}
          </h3>
          <div className="space-y-4">
            {Object.entries(
              filteredEntries.reduce((acc, entry) => {
                acc[entry.vehicleNo] = (acc[entry.vehicleNo] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([vehicle, count], index) => (
                <div key={vehicle} className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                      index === 0 ? 'from-yellow-400 to-orange-500' :
                      index === 1 ? 'from-gray-300 to-gray-500' :
                      index === 2 ? 'from-orange-400 to-red-500' :
                      'from-blue-400 to-purple-500'
                    } flex items-center justify-center text-white font-bold text-sm mr-3`}>
                      {index + 1}
                    </div>
                    <span className="font-mono text-sm font-medium text-white">{vehicle}</span>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-600/50 px-3 py-1 rounded-full">
                    {count} trips
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-400" />
            Top Drivers by Usage {selectedMonth && '(Filtered)'}
          </h3>
          <div className="space-y-4">
            {Object.entries(
              filteredEntries.reduce((acc, entry) => {
                acc[entry.driverName] = (acc[entry.driverName] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([driver, count], index) => (
                <div key={driver} className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                      index === 0 ? 'from-yellow-400 to-orange-500' :
                      index === 1 ? 'from-gray-300 to-gray-500' :
                      index === 2 ? 'from-orange-400 to-red-500' :
                      'from-green-400 to-blue-500'
                    } flex items-center justify-center text-white font-bold text-sm mr-3`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-white">{driver}</span>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-600/50 px-3 py-1 rounded-full">
                    {count} trips
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};