/**
 * Utility to calculate Smart Score (0 - 100) and sub-scores for a vehicle.
 */
function calculateSmartScore(car) {
  if (!car) return { overall: 80, subScores: {} };

  // 1. Safety Score (0-100): Safety Rating (5 stars = 100) + Airbags bonus
  const safetyStars = car.safetyRating || 4;
  const airbags = car.airbags || 2;
  const safetyScore = Math.min(100, Math.round((safetyStars / 5) * 80 + Math.min(airbags * 4, 20)));

  // 2. Mileage Score (0-100): 25+ kmpl is 100, EV is 100
  let mileageScore = 70;
  if (car.fuelType === 'Electric') {
    mileageScore = 95;
  } else if (car.mileage) {
    mileageScore = Math.min(100, Math.round((car.mileage / 25) * 100));
  }

  // 3. Performance Score (0-100): Horsepower + Torque
  const hp = car.horsepower || 100;
  const torque = car.torque || 150;
  const performanceScore = Math.min(100, Math.round((hp / 220) * 50 + (torque / 350) * 50));

  // 4. Value for Money (0-100): Price vs Features & Specs ratio
  const priceInLakhs = car.price > 100000 ? car.price / 100000 : car.price;
  const featureCount = car.features ? car.features.length : 5;
  let valueScore = Math.min(100, Math.round(75 + featureCount * 2 - priceInLakhs * 0.8));
  valueScore = Math.max(50, Math.min(98, valueScore));

  // 5. Maintenance Score (0-100): Lower service cost = higher score
  const serviceCost = car.serviceCost || 6000;
  const maintenanceScore = Math.max(40, Math.min(100, Math.round(100 - (serviceCost / 20000) * 40)));

  // 6. Resale Value Score (0-100)
  const resaleScore = Math.min(100, Math.round(car.resaleValue || 70));

  // Overall Weighted Average
  const overall = Math.round(
    safetyScore * 0.22 +
      mileageScore * 0.2 +
      valueScore * 0.2 +
      performanceScore * 0.15 +
      maintenanceScore * 0.13 +
      resaleScore * 0.1
  );

  return {
    overall: Math.max(60, Math.min(99, overall)),
    subScores: {
      safety: safetyScore,
      mileage: mileageScore,
      performance: performanceScore,
      valueForMoney: valueScore,
      maintenance: maintenanceScore,
      resale: resaleScore,
    },
  };
}

module.exports = calculateSmartScore;
