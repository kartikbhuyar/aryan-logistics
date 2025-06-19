
import React, { useState } from 'react';
import type { JSX } from 'react';

import { Plus, Save, Sparkles, MapPin, User, Truck, Calendar, Hash } from 'lucide-react';
import type { LogisticsEntry } from '../types';
import { addEntry, loadEntries } from '../utils/storage';

interface EntryFormProps {
  onEntryAdded: (entry: LogisticsEntry) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    srNo: '',
    date: new Date().toISOString().split('T')[0],
    particular: '',
    chalanNo: '',
    vehicleNo: '',
    driverName: '',
    from: '',
    to: '',
    quantity: '',
    amount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let srNo = parseInt(formData.srNo);
      if (!srNo) {
        const entries = loadEntries();
        srNo = entries.length + 1;
      }

      const entry = addEntry({
        srNo,
        date: formData.date,
        particular: formData.particular,
        chalanNo: formData.chalanNo,
        vehicleNo: formData.vehicleNo.toUpperCase(),
        driverName: formData.driverName,
        from: formData.from,
        to: formData.to,
        quantity: parseFloat(formData.quantity) || 0,
        amount: parseFloat(formData.amount) || 0
      });

      onEntryAdded(entry);

      setFormData({
        srNo: '',
        date: new Date().toISOString().split('T')[0],
        particular: '',
        chalanNo: '',
        vehicleNo: '',
        driverName: '',
        from: '',
        to: '',
        quantity: '',
        amount: ''
      });
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200';

  const formGroup = (label: string, name: string, type = 'text', icon: JSX.Element, required = false, placeholder = '', step?: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          step={step}
          className={inputClass}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6">
      <div className="flex items-center mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg mr-3">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Add New Entry
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formGroup('SR. NO.', 'srNo', 'number', <Hash className="h-5 w-5" />)}
            {formGroup('Date', 'date', 'date', <Calendar className="h-5 w-5" />, true)}
            {formGroup('Chalan No.', 'chalanNo', 'text', <Hash className="h-5 w-5" />, true, 'e.g., CH001')}
            {formGroup('Vehicle No.', 'vehicleNo', 'text', <Truck className="h-5 w-5" />, true, 'e.g., MH01AB1234')}
          </div>
        </div>

        {/* Personnel */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            Personnel & Description
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formGroup('Driver Name', 'driverName', 'text', <User className="h-5 w-5" />, true)}
            {formGroup('Particular', 'particular', 'text', <Sparkles className="h-5 w-5" />, true, 'Description')}
          </div>
        </div>

        {/* Route */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-400" />
            Route & Quantity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formGroup('From', 'from', 'text', <MapPin className="h-5 w-5" />, true)}
            {formGroup('To', 'to', 'text', <MapPin className="h-5 w-5" />, true)}
            {formGroup('Quantity', 'quantity', 'number', <Hash className="h-5 w-5" />, true, '0.00', '0.01')}
            {formGroup('Amount (₹)', 'amount', 'number', <span className="text-sm">₹</span>, false, '0.00', '0.01')}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};
