import { User } from "./types";

export const mockUsers = new Map<number, User>([
    [1, { id: 1, name: "John Doe", email: "john@example.com" }],
    [2, { id: 2, name: "Jane Smith", email: "jane@example.com" }],
    [3, { id: 3, name: "Alice Johnson", email: "alice@example.com" }]
]);

let nextId = 4;

export function getUserFromMock(id: number): User | undefined {
    return mockUsers.get(id);
}

export function createUserInMock(name: string, email: string): User {
    const u: User = { id: nextId++, name, email };
    mockUsers.set(u.id, u);
    return u;
}
