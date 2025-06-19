export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getMonthYear = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7); // YYYY-MM format
};

export const getMonthOptions = (): Array<{ value: string; label: string }> => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const value = date.toISOString().slice(0, 7);
    const label = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    months.push({ value, label });
  }
  
  return months;
};