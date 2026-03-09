// Scoring utilities
export function calculateCompatibilityScore(user1, user2, trip1, trip2) {
  let score = 0;

  // Date overlap scoring
  const overlap = getDateOverlap(
    trip1.startDate,
    trip1.endDate,
    trip2.startDate,
    trip2.endDate,
  );
  score += Math.min(overlap * 2.5, 25);

  // Same destination bonus
  if (trip1.destination === trip2.destination) {
    score += 25;
  } else if (trip1.country === trip2.country) {
    score += 10;
  }

  // Shared travel styles
  const sharedStyles = intersect(user1.travelStyles, user2.travelStyles);
  score += Math.min(sharedStyles.length * 5, 20);

  // Language match
  const sharedLangs = intersect(user1.languages, user2.languages);
  score += Math.min(sharedLangs.length * 7, 15);

  // Budget compatibility
  if (trip1.budget === trip2.budget) {
    score += 10;
  } else if (budgetDiff(trip1.budget, trip2.budget) === 1) {
    score += 5;
  }

  // Shared interests
  const sharedInterests = intersect(user1.interestTags, user2.interestTags);
  score += Math.min(sharedInterests.length, 5);

  return Math.round(Math.min(score, 100));
}

// Helper functions
function getDateOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  const start = Math.max(s1, s2);
  const end = Math.min(e1, e2);

  return start <= end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : 0;
}

function intersect(arr1, arr2) {
  return arr1.filter((item) => arr2.includes(item));
}

function budgetDiff(b1, b2) {
  const budgets = ["budget", "mid-range", "luxury"];
  return Math.abs(budgets.indexOf(b1) - budgets.indexOf(b2));
}

// Constants
export const TRAVELER_TYPES = [
  { id: "backpacker", label: "Backpacker" },
  { id: "budget", label: "Budget Explorer" },
  { id: "comfort", label: "Comfort Seeker" },
  { id: "adventure", label: "Adventure Seeker" },
  { id: "luxury", label: "Luxury Traveler" },
  { id: "cultural", label: "Cultural Immersionist" },
];

export const DIETARY_OPTIONS = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
];

export const INTEREST_TAGS = [
  { id: "photography", label: "Photography" },
  { id: "hiking", label: "Hiking" },
  { id: "street_food", label: "Street Food" },
  { id: "nightlife", label: "Nightlife" },
  { id: "museums", label: "Museums" },
  { id: "water_sports", label: "Water Sports" },
  { id: "road_trips", label: "Road Trips" },
  { id: "wildlife", label: "Wildlife" },
  { id: "yoga", label: "Yoga & Wellness" },
  { id: "shopping", label: "Shopping" },
  { id: "music", label: "Music" },
  { id: "history", label: "History" },
];

export const TRIP_VIBES = [
  { id: "urban", label: "Urban City" },
  { id: "wilderness", label: "Wilderness" },
  { id: "beach", label: "Beach" },
  { id: "mountains", label: "Mountains" },
  { id: "heritage", label: "Heritage" },
  { id: "luxury", label: "Luxury" },
];

export const BUDGET_LEVELS = [
  { id: "budget", label: "$ Budget ($20-40/day)" },
  { id: "mid-range", label: "$$ Mid-range ($40-100/day)" },
  { id: "luxury", label: "$$$ Luxury ($100+/day)" },
];
