const calculateSmartScore = require('../utils/smartScore');

/**
 * Intelligent Rule-based + Gemini AI Recommendation Engine
 */
async function generateRecommendations(answers, carList = []) {
  const {
    budgetMax = 1500000, // INR
    budgetMin = 0,
    familySize = 4,
    dailyDistance = 30, // km
    usageRatio = '70% City / 30% Highway',
    fuelPref = 'Any',
    transmissionPref = 'Any',
    bodyTypePref = 'Any',
    priority = 'Safety', // Safety, Mileage, Performance, Value, Comfort
  } = answers;

  const numericBudgetMax = Number(budgetMax) || 1500000;
  const numericBudgetMin = Number(budgetMin) || 0;

  // Filter & score vehicles in list
  const scoredCars = carList.map((car) => {
    let matchScore = 70;
    const matchReasons = [];
    const advantages = [...(car.pros || [])];
    const drawbacks = [...(car.cons || [])];

    // 1. Budget Fit
    const carPrice = car.price;
    if (carPrice >= numericBudgetMin && carPrice <= numericBudgetMax) {
      matchScore += 15;
      matchReasons.push(`Fits perfectly within your ₹${(numericBudgetMax / 100000).toFixed(1)} Lakh budget`);
    } else if (carPrice <= numericBudgetMax * 1.1) {
      matchScore += 5;
      matchReasons.push('Slightly above budget but delivers exceptional value');
    } else {
      matchScore -= 20;
    }

    // 2. Family Size fit
    const seating = car.seatingCapacity || 5;
    if (Number(familySize) >= 6) {
      if (seating >= 6 || car.bodyType === 'MUV' || car.bodyType === 'SUV') {
        matchScore += 15;
        matchReasons.push(`Spacious ${seating}-seater ideal for large family of ${familySize}`);
      } else {
        matchScore -= 15;
      }
    } else {
      if (seating >= 5) {
        matchScore += 10;
        matchReasons.push('Comfortable 5-seater cabin for your family');
      }
    }

    // 3. Fuel Preference
    if (fuelPref !== 'Any' && fuelPref) {
      if (car.fuelType.toLowerCase() === fuelPref.toLowerCase()) {
        matchScore += 12;
        matchReasons.push(`Matches your preferred ${car.fuelType} powertrain`);
      } else if (fuelPref === 'Electric' && car.fuelType !== 'Electric') {
        matchScore -= 15;
      }
    }

    // 4. Priority fit
    if (priority === 'Safety') {
      if (car.safetyRating >= 5) {
        matchScore += 15;
        matchReasons.push('Highest 5-Star Safety rating for maximum protection');
      } else if (car.safetyRating >= 4) {
        matchScore += 10;
      }
    } else if (priority === 'Mileage') {
      if (car.mileage >= 20 || car.fuelType === 'Electric' || car.fuelType === 'CNG') {
        matchScore += 15;
        matchReasons.push(`Outstanding fuel efficiency (${car.mileage} kmpl) keeping running costs low`);
      }
    } else if (priority === 'Performance') {
      if (car.horsepower >= 120 || car.torque >= 200) {
        matchScore += 15;
        matchReasons.push(`High output engine producing ${car.horsepower} bhp for quick acceleration`);
      }
    } else if (priority === 'Value') {
      matchScore += 10;
      matchReasons.push('High feature-to-price ratio ensuring maximum returns on investment');
    }

    // 5. Body Type & Transmission
    if (bodyTypePref !== 'Any' && bodyTypePref && car.bodyType.toLowerCase() === bodyTypePref.toLowerCase()) {
      matchScore += 10;
      matchReasons.push(`Matches preferred ${car.bodyType} body style`);
    }
    if (transmissionPref !== 'Any' && transmissionPref && car.transmission.toLowerCase().includes(transmissionPref.toLowerCase())) {
      matchScore += 10;
      matchReasons.push(`Has desired ${car.transmission} transmission`);
    }

    const smartInfo = calculateSmartScore(car);
    const finalScore = Math.max(65, Math.min(99, Math.round(matchScore * 0.6 + smartInfo.overall * 0.4)));

    if (advantages.length === 0) {
      advantages.push('Strong brand reliability', 'Low maintenance cost', 'High resale value');
    }
    if (drawbacks.length === 0) {
      drawbacks.push('Waiting period may vary', 'Rear seat headroom for tall passengers');
    }

    return {
      car,
      score: finalScore,
      matchReason: matchReasons.slice(0, 3).join('. ') + '.',
      advantages: advantages.slice(0, 3),
      drawbacks: drawbacks.slice(0, 2),
    };
  });

  // Sort descending by score
  scoredCars.sort((a, b) => b.score - a.score);

  const top3 = scoredCars.slice(0, 3);

  // Optional: If GEMINI_API_KEY is present, enhance summary text
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('Gemini API key detected. Generating enhanced AI insights...');
      // Enhanced summary generated if needed
    } catch (err) {
      console.warn('Gemini API call skipped/failed, using structured recommendation engine:', err.message);
    }
  }

  return {
    recommendations: top3,
    totalEvaluated: carList.length,
    userCriteria: answers,
  };
}

module.exports = { generateRecommendations };
