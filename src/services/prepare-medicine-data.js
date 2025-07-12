import { serverTimestamp } from "firebase/firestore";
export function calculateEstimatedStock(medicine) {
  const purchaseDate = new Date(medicine.purchase_date);
  const today = new Date();
  const daysGone = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
  const dailyDose = parseFloat(medicine.daily_dose || 0);
  const originalStock = parseFloat(medicine.original_stock || 0);
  const addedStock = parseFloat(medicine.pills_ml || 0)

  const totalInitialStock = originalStock + addedStock-2;
  const estimatedStock = Math.max(0, totalInitialStock - daysGone * dailyDose);

  return Math.floor(estimatedStock);
}

export const prepareMedicineData = (input) => {
  const {
    name,
    price,
    pills_ml,
    purchase_date,
    limit_stock,
    daily_dose,
    categories = [],
    manual_stock_correction,
  } = input;

  const createdAt = new Date();
  const createdFormatted = createdAt.toLocaleString("es-AR");

  
  const parsed = {
    name,
    price: parseFloat(price) || 0,
    purchase_date,
    pills_ml: parseFloat(pills_ml || 0),
    limit_stock: parseFloat(limit_stock) || 0,
    daily_dose: parseFloat(daily_dose) || 0,
    manual_stock_correction: parseFloat(manual_stock_correction || 0),
    categories,
    created: serverTimestamp(),
    created_display: createdFormatted,
  };

  const estimated_stock = calculateEstimatedStock(parsed);
  const final_stock = getFinalStock(parsed)
  let repurchase_date = null;
  if (parsed.daily_dose > 0) {
    const daysUntilLimit =Math.floor(
      (final_stock - parsed.limit_stock)/parsed.daily_dose
    );
    const repurchaseDate = new Date()
    repurchaseDate.setDate(repurchaseDate.getDate() + daysUntilLimit);
    repurchase_date = repurchaseDate.toISOString().split("T")[0];
  }
  return {
    ...parsed,
    estimated_stock,
    final_stock,
    repurchase_date,
  };
};
function getFinalStock(medicine) {
  const correction = parseFloat(medicine.manual_stock_correction || 0);
  const estimated = calculateEstimatedStock(medicine);
  return correction > 0 ? correction : estimated;
}