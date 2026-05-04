export function filterLocations(locations, filters) {
    return locations.filter((location) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;

            if (key === "openNow") {
                return Boolean(location.openNow);
            }

            return location.services?.includes(key);
        });
    });
}