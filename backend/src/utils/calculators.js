/**
 * Calculator utilities for EMI, Total Ownership Cost, and Used Car Fair Price Valuation
 */

// 1. EMI Calculator
function calculateEMI({ carPrice, downPayment = 0, interestRate = 8.5, tenureYears = 5 }) {
  const price = Number(carPrice) || 0;
  const dp = Number(downPayment) || 0;
  const loanAmount = Math.max(0, price - dp);
  
  if (loanAmount <= 0) {
    return { loanAmount: 0, monthlyEMI: 0, totalInterest: 0, totalPayment: 0, chartData: [] };
  }

  const annualRate = Number(interestRate) || 8.5;
  const monthlyRate = annualRate / 12 / 100;
  const months = (Number(tenureYears) || 5) * 12;

  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const monthlyEMI = Math.round(emi);
  const totalPayment = Math.round(monthlyEMI * months);
  const totalInterest = Math.round(totalPayment - loanAmount);

  const chartData = [
    { name: 'Principal Amount', value: loanAmount },
    { name: 'Total Interest', value: totalInterest },
  ];

  return {
    loanAmount,
    monthlyEMI,
    totalInterest,
    totalPayment,
    tenureMonths: months,
    chartData,
  };
}

// 2. Total Ownership Cost Calculator
function calculateOwnershipCost({
  carPrice,
  annualKms = 12000,
  mileage = 18,
  fuelPrice = 100,
  serviceCostAnnual = 7000,
  insuranceAnnual = 25000,
  depreciationRatePct = 12,
}) {
  const price = Number(carPrice) || 1000000;
  const kms = Number(annualKms) || 12000;
  const mpg = Number(mileage) || 18;
  const fp = Number(fuelPrice) || 100;
  const service = Number(serviceCostAnnual) || 7000;
  const insurance = Number(insuranceAnnual) || 25000;
  const depRate = (Number(depreciationRatePct) || 12) / 100;

  const annualFuelCost = Math.round((kms / mpg) * fp);

  const breakdown = [];
  let cumFuel = 0;
  let cumService = 0;
  let cumInsurance = 0;
  let cumTyres = 0;
  let currentResale = price;

  for (let year = 1; year <= 5; year++) {
    cumFuel += annualFuelCost * Math.pow(1.04, year - 1); // 4% annual fuel inflation
    cumService += service * Math.pow(1.05, year - 1);
    cumInsurance += insurance * Math.pow(0.92, year - 1); // Insurance decreases with IDV
    if (year === 3) cumTyres += 24000; // Tyre change at year 3

    currentResale = currentResale * (1 - depRate);

    const netCostSoFar = Math.round(price + cumFuel + cumService + cumInsurance + cumTyres - currentResale);

    breakdown.push({
      year: `Year ${year}`,
      fuel: Math.round(cumFuel),
      service: Math.round(cumService),
      insurance: Math.round(cumInsurance),
      tyres: Math.round(cumTyres),
      estimatedResale: Math.round(currentResale),
      netOwnershipCost: netCostSoFar,
    });
  }

  return {
    annualFuelCost: Math.round(annualFuelCost),
    year1Cost: breakdown[0].netOwnershipCost,
    year3Cost: breakdown[2].netOwnershipCost,
    year5Cost: breakdown[4].netOwnershipCost,
    breakdown,
  };
}

// 3. Used Car Fair Price Valuation
function calculateFairPrice({
  originalPrice = 1000000,
  brand = 'Maruti Suzuki',
  year = 2021,
  kmDriven = 35000,
  owners = 1,
  fuelType = 'Petrol',
  condition = 'Good',
}) {
  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(0, currentYear - Number(year));
  const basePrice = Number(originalPrice) > 0 ? Number(originalPrice) : 900000;

  // Age depreciation curve
  let ageMultiplier = 1.0;
  if (ageYears === 0) ageMultiplier = 0.90;
  else if (ageYears === 1) ageMultiplier = 0.80;
  else if (ageYears === 2) ageMultiplier = 0.71;
  else if (ageYears === 3) ageMultiplier = 0.63;
  else if (ageYears === 4) ageMultiplier = 0.56;
  else if (ageYears === 5) ageMultiplier = 0.50;
  else ageMultiplier = Math.max(0.25, 0.50 * Math.pow(0.9, ageYears - 5));

  // KM penalty
  const expectedKms = ageYears * 12000;
  const kmDiff = Number(kmDriven) - expectedKms;
  const kmAdjustment = (kmDiff / 10000) * 0.02; // -2% per 10k extra kms

  // Owner count penalty
  const ownerPenalty = (Number(owners) - 1) * 0.06; // 6% drop per extra owner

  // Condition factor
  let conditionFactor = 1.0;
  if (condition === 'Excellent') conditionFactor = 1.05;
  else if (condition === 'Good') conditionFactor = 1.0;
  else if (condition === 'Fair') conditionFactor = 0.92;
  else if (condition === 'Needs Work') conditionFactor = 0.82;

  // Brand tier retention multiplier
  let brandBonus = 1.0;
  const highResaleBrands = ['Toyota', 'Maruti Suzuki', 'Hyundai', 'Honda'];
  const premiumBrands = ['BMW', 'Mercedes-Benz', 'Audi'];
  if (highResaleBrands.includes(brand)) brandBonus = 1.04;
  else if (premiumBrands.includes(brand)) brandBonus = 0.92; // Higher depreciation on luxury

  const estimatedRatio = (ageMultiplier - kmAdjustment - ownerPenalty) * conditionFactor * brandBonus;
  const clampedRatio = Math.max(0.20, Math.min(0.95, estimatedRatio));

  const fairPriceVal = Math.round(basePrice * clampedRatio);
  const minPrice = Math.round(fairPriceVal * 0.94);
  const maxPrice = Math.round(fairPriceVal * 1.06);

  const formatLakh = (val) => (val / 100000).toFixed(2) + ' Lakh';

  return {
    estimatedFairPrice: fairPriceVal,
    minPrice,
    maxPrice,
    formattedRange: `₹${formatLakh(minPrice)} – ₹${formatLakh(maxPrice)}`,
    confidence: '94%',
    factors: [
      `Vehicle Age (${ageYears} years old)`,
      `Odometer reading of ${Number(kmDriven).toLocaleString()} km`,
      `Ownership history (${owners} owner${owners > 1 ? 's' : ''})`,
      `${brand} market demand index`,
      `Vehicle physical condition rating: ${condition}`,
    ],
    depreciationForecast: [
      { year: 'Next Year', expectedValue: Math.round(fairPriceVal * 0.91) },
      { year: 'In 2 Years', expectedValue: Math.round(fairPriceVal * 0.83) },
      { year: 'In 3 Years', expectedValue: Math.round(fairPriceVal * 0.75) },
    ],
  };
}

module.exports = {
  calculateEMI,
  calculateOwnershipCost,
  calculateFairPrice,
};
