/**
 * Utility functions for finding adjacent seats
 */

import type { FlatSeat } from "./types";

/**
 * Find N adjacent available seats in a venue
 * @param seats - Array of all seats in the venue
 * @param count - Number of adjacent seats to find
 * @param neighbors - Map of seat neighbors
 * @returns Array of seat IDs that form a group of N adjacent seats, or null if not found
 */
export function findAdjacentSeats(
    seats: FlatSeat[],
    count: number,
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    }
): string[] | null {
    if (count <= 0) return null;
    if (count === 1) {
        // Find any available seat
        const available = seats.find(s => s.status === "available");
        return available ? [available.id] : null;
    }

    // Get all available seats
    const availableSeats = seats.filter(s => s.status === "available");
    
    // Try to find horizontal adjacent seats first (left-right)
    for (const seat of availableSeats) {
        const group = findHorizontalGroup(seat, count, neighbors, availableSeats);
        if (group) return group;
    }

    // If no horizontal group found, try vertical (up-down)
    for (const seat of availableSeats) {
        const group = findVerticalGroup(seat, count, neighbors, availableSeats);
        if (group) return group;
    }

    // If no vertical group found, try diagonal or any available pattern
    return findAnyAdjacentGroup(seats, count, neighbors);
}

/**
 * Find horizontal group of N adjacent seats
 */
function findHorizontalGroup(
    startSeat: FlatSeat,
    count: number,
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    },
    availableSeats: FlatSeat[]
): string[] | null {
    const group: string[] = [startSeat.id];
    let currentSeat = startSeat;
    
    // Try to extend to the right
    for (let i = 1; i < count; i++) {
        const rightId = neighbors.right.get(currentSeat.id);
        if (!rightId) break;
        
        const rightSeat = availableSeats.find(s => s.id === rightId);
        if (!rightSeat || rightSeat.status !== "available") break;
        
        group.push(rightSeat.id);
        currentSeat = rightSeat;
    }
    
    if (group.length === count) return group;
    
    // If we didn't get enough seats going right, try going left from start
    currentSeat = startSeat;
    for (let i = 1; i < count; i++) {
        const leftId = neighbors.left.get(currentSeat.id);
        if (!leftId) break;
        
        const leftSeat = availableSeats.find(s => s.id === leftId);
        if (!leftSeat || leftSeat.status !== "available") break;
        
        group.unshift(leftSeat.id);
        currentSeat = leftSeat;
    }
    
    return group.length === count ? group : null;
}

/**
 * Find vertical group of N adjacent seats
 */
function findVerticalGroup(
    startSeat: FlatSeat,
    count: number,
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    },
    availableSeats: FlatSeat[]
): string[] | null {
    const group: string[] = [startSeat.id];
    let currentSeat = startSeat;
    
    // Try to extend downward
    for (let i = 1; i < count; i++) {
        const downId = neighbors.down.get(currentSeat.id);
        if (!downId) break;
        
        const downSeat = availableSeats.find(s => s.id === downId);
        if (!downSeat || downSeat.status !== "available") break;
        
        group.push(downSeat.id);
        currentSeat = downSeat;
    }
    
    if (group.length === count) return group;
    
    // If we didn't get enough seats going down, try going up from start
    currentSeat = startSeat;
    for (let i = 1; i < count; i++) {
        const upId = neighbors.up.get(currentSeat.id);
        if (!upId) break;
        
        const upSeat = availableSeats.find(s => s.id === upId);
        if (!upSeat || upSeat.status !== "available") break;
        
        group.unshift(upSeat.id);
        currentSeat = upSeat;
    }
    
    return group.length === count ? group : null;
}

/**
 * Find any group of N adjacent seats using a more flexible approach
 */
function findAnyAdjacentGroup(
    seats: FlatSeat[],
    count: number,
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    }
): string[] | null {
    const availableSeats = seats.filter(s => s.status === "available");
    
    // Use a BFS approach to find connected components
    const visited = new Set<string>();
    
    for (const seat of availableSeats) {
        if (visited.has(seat.id)) continue;
        
        const component = findConnectedComponent(seat, neighbors, availableSeats, visited);
        if (component.length >= count) {
            // Return the first N seats from this component
            return component.slice(0, count);
        }
    }
    
    return null;
}

/**
 * Find all seats connected to a starting seat
 */
function findConnectedComponent(
    startSeat: FlatSeat,
    neighbors: {
        left: Map<string, string | null>;
        right: Map<string, string | null>;
        up: Map<string, string | null>;
        down: Map<string, string | null>;
    },
    availableSeats: FlatSeat[],
    visited: Set<string>
): string[] {
    const component: string[] = [];
    const queue: string[] = [startSeat.id];
    
    while (queue.length > 0) {
        const seatId = queue.shift()!;
        if (visited.has(seatId)) continue;
        
        visited.add(seatId);
        component.push(seatId);
        
        // Add all unvisited neighbors to the queue
        const directions = [
            neighbors.left.get(seatId),
            neighbors.right.get(seatId),
            neighbors.up.get(seatId),
            neighbors.down.get(seatId)
        ];
        
        for (const neighborId of directions) {
            if (neighborId && !visited.has(neighborId)) {
                const neighbor = availableSeats.find(s => s.id === neighborId);
                if (neighbor && neighbor.status === "available") {
                    queue.push(neighborId);
                }
            }
        }
    }
    
    return component;
}
