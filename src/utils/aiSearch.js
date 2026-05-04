export function parseAiSearch(input) {
    const text = input.toLowerCase();

    const filters = {
        city: "",
        type: "All",
        maxPrice: 1300000,
        minBeds: 0,
        tags: [],
    };

    const cities = ["austin", "miami", "denver", "malibu", "new york", "seattle"];
    const foundCity = cities.find((city) => text.includes(city));

    if (foundCity) filters.city = foundCity;

    if (text.includes("studio")) filters.type = "Studio";
    if (text.includes("apartment") || text.includes("flat")) filters.type = "Apartment";
    if (text.includes("house") || text.includes("home")) filters.type = "House";
    if (text.includes("townhouse")) filters.type = "Townhouse";
    if (text.includes("villa")) filters.type = "Villa";

    if (text.includes("cheap") || text.includes("budget")) filters.maxPrice = 400000;
    if (text.includes("mid")) filters.maxPrice = 750000;

    if (text.includes("2 bed")) filters.minBeds = 2;
    if (text.includes("3 bed")) filters.minBeds = 3;
    if (text.includes("4 bed")) filters.minBeds = 4;

    const tagWords = [
        "family",
        "quiet",
        "schools",
        "garage",
        "downtown",
        "parking",
        "luxury",
        "beach",
        "pool",
        "garden",
        "eco",
    ];

    filters.tags = tagWords.filter((tag) => text.includes(tag));

    return filters;
}