export default function calculateEstimatedStock(medicine) {
  const purchaseDate = new Date(medicine.purchase_date);
  const today = new Date();
  const daysGone = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
  const dailyDose = parseFloat(medicine.daily_dose || 0);
  const originalStock = parseFloat(medicine.current_stock || 0);
  const estimatedStock = Math.max(0, originalStock - daysGone * dailyDose);
  return Math.floor(estimatedStock);
}
