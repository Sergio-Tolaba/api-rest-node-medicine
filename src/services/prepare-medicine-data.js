import { serverTimestamp } from "firebase/firestore";
export function calculateEstimatedStock(medicine) {
  const purchaseDate = new Date(medicine.purchase_date);
  const today = new Date();
  const daysGone = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
  const dailyDose = parseFloat(medicine.daily_dose || 0);
  const originalStock = parseFloat(medicine.current_stock || 0);
  const estimatedStock = Math.max(0, originalStock - daysGone * dailyDose);
  return Math.floor(estimatedStock);
}

export const prepareMedicineData = (input) => {
  const {
    name,
    price,
    purchase_date,
    current_stock,
    limit_stock,
    daily_dose,
    categories = [],
  } = input;

  const createdAt = new Date();
  const createdFormatted = createdAt.toLocaleString("es-AR");

  const parsed = {
    name,
    price: parseFloat(price) || 0,
    purchase_date,
    current_stock: parseFloat(current_stock) || 0,
    limit_stock: parseFloat(limit_stock) || 0,
    daily_dose: parseFloat(daily_dose) || 0,
    categories,
    created: serverTimestamp(),
    created_display: createdFormatted,
  };

  const estimated_stock = calculateEstimatedStock(parsed);
  const daysUntilLimit = Math.floor(
    (estimated_stock - parsed.limit_stock) / parsed.daily_dose
  );

  const repurchaseDate = new Date();
  repurchaseDate.setDate(repurchaseDate.getDate() + daysUntilLimit);

  return {
    ...parsed,
    estimated_stock,
    repurchase_date: repurchaseDate.toISOString().split("T")[0],
  };
};