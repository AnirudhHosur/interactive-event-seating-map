/**
 * Heat-map color utilities for visualizing seat pricing
 */

// Color scheme for price tiers (from expensive to cheap)
export const HEAT_MAP_COLORS = {
    1: "#d32f2f", // Red - Premium (most expensive)
    2: "#f57c00", // Orange - Standard
    3: "#fbc02d", // Yellow - Economy
    4: "#388e3c", // Green - Budget (cheapest)
} as const;

/**
 * Get heat-map color for a price tier
 */
export function getHeatMapColor(priceTier: number): string {
    return HEAT_MAP_COLORS[priceTier as keyof typeof HEAT_MAP_COLORS] ?? "#9e9e9e";
}

/**
 * Get heat-map color with opacity for better visibility
 */
export function getHeatMapColorWithOpacity(priceTier: number, opacity: number = 0.8): string {
    const color = getHeatMapColor(priceTier);
    // Convert hex to rgba for opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get contrasting text color for heat-map backgrounds
 */
export function getContrastTextColor(priceTier: number): string {
    // Use white text for darker colors, black for lighter colors
    const color = getHeatMapColor(priceTier);
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? "#000000" : "#ffffff";
}
