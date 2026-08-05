export const packageDetailsContent = {
  "Kalinchowk Tour Package": {
    highlights: [
      "Explore the beautiful hill town of Kharidhunga",
      "Enjoy stunning views from Sailung",
      "Visit the sacred Dolakha Bhimsen Temple",
      "Take blessings at Kalinchowk Bhagwati Temple",
      "Explore the snowy charm of Kuri Village",
      "Experience local vibes and nightlife at Kuri Bazaar",
    ],
    inclusions: [
      "Transportation by Bus/Scorpio",
      "Sightseeing as per itinerary",
      "1 Non-Veg Dinner",
      "2 Veg Lunches",
      "Breakfast",
      "Accommodation on sharing basis",
    ],
    experience:
      "This short yet refreshing trip to Kalinchowk offers a perfect mix of natural beauty, adventure, and spirituality. From scenic drives and snow-covered landscapes to temple visits and peaceful village life, it’s an ideal getaway from the busy city.",
  },
};

export function getPackageDetailsContent(title = "") {
  return (
    packageDetailsContent[title] || {
      highlights: [
        "Discover memorable destinations",
        "Enjoy a well-planned travel itinerary",
        "Experience scenic routes and local culture",
      ],
      inclusions: [
        "Transportation",
        "Sightseeing as per itinerary",
        "Accommodation",
        "Meals as specified by the package",
      ],
      experience:
        "This package is designed to balance comfort, sightseeing, and local experiences for a smooth and enjoyable journey.",
    }
  );
}
