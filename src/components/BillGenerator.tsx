import React, { useState } from 'react';
import { FileText, Download, Printer, Sparkles } from 'lucide-react';
import type { LogisticsEntry } from '../types';
import { formatDate, getMonthOptions } from '../utils/dateUtils';

interface BillGeneratorProps {
  entries: LogisticsEntry[];
}

export const BillGenerator: React.FC<BillGeneratorProps> = ({ entries }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [billDetails, setBillDetails] = useState({
    billTo: '',
    billFrom: 'Aryan Enterprises',
    address: 'Your Company Address',
    gstNo: '',
    billNo: `BILL-${Date.now().toString().slice(-6)}`
  });

  const monthOptions = getMonthOptions();
  
  const filteredEntries = selectedMonth 
    ? entries.filter(entry => entry.date.startsWith(selectedMonth))
    : [];

  //const totalQuantity = filteredEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = filteredEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const gstAmount = totalAmount * 0.18; // 18% GST
  const finalAmount = totalAmount + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    // For a full implementation, you would use a library like jsPDF
    // For now, we'll use the browser's print functionality
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg mr-3">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          Bill Generator
        </h2>
      </div>

      {/* Bill Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
          Bill Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Month *
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select Month</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bill Number
            </label>
            <input
              type="text"
              value={billDetails.billNo}
              onChange={(e) => setBillDetails(prev => ({ ...prev, billNo: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bill To *
            </label>
            <input
              type="text"
              value={billDetails.billTo}
              onChange={(e) => setBillDetails(prev => ({ ...prev, billTo: e.target.value }))}
              placeholder="Customer name"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GST Number
            </label>
            <input
              type="text"
              value={billDetails.gstNo}
              onChange={(e) => setBillDetails(prev => ({ ...prev, gstNo: e.target.value }))}
              placeholder="GST registration number"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {selectedMonth && filteredEntries.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Bill
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Bill Preview */}
      {selectedMonth && filteredEntries.length > 0 && billDetails.billTo && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 print:shadow-none" id="bill-content">
          <div className="border-b-2 border-gray-300 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-lg text-gray-600">#{billDetails.billNo}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900">{billDetails.billFrom}</h2>
                <p className="text-gray-600 mt-1">{billDetails.address}</p>
                {billDetails.gstNo && (
                  <p className="text-gray-600">GST: {billDetails.gstNo}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-700">{billDetails.billTo}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Date:</h3>
              <p className="text-gray-700">{formatDate(new Date().toISOString())}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">Period:</h3>
              <p className="text-gray-700">
                {monthOptions.find(m => m.value === selectedMonth)?.label}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">SR.</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Particular</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Vehicle</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Route</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3">{formatDate(entry.date)}</td>
                    <td className="border border-gray-300 px-4 py-3">{entry.particular}</td>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">{entry.vehicleNo}</td>
                    <td className="border border-gray-300 px-4 py-3">{entry.from} → {entry.to}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{entry.quantity}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      ₹{(entry.amount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-medium">Subtotal:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-medium">GST (18%):</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 text-xl font-bold border-b-2 border-gray-300">
                <span>Total:</span>
                <span>₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Thank you for your business. Payment is due within 30 days of invoice date.
            </p>
          </div>
        </div>
      )}

      {selectedMonth && filteredEntries.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-400 text-lg">No entries found for the selected month.</p>
        </div>
      )}
    </div>
  );
};