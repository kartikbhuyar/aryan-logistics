export interface LogisticsEntry {
  id: string;
  srNo: number;
  date: string;
  particular: string;
  chalanNo: string;
  vehicleNo: string;
  driverName: string;
  from: string;
  to: string;
  quantity: number;
  amount?: number;
  createdAt: string;
}

export interface MonthlySummary {
  month: string;
  totalEntries: number;
  totalQuantity: number;
  totalAmount: number;
  entries: LogisticsEntry[];
}

export interface FilterOptions {
  month: string;
  year: string;
  vehicleNo?: string;
  driverName?: string;
}