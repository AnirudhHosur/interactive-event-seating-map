/** Example pricing model (documented in README). Adjust tiers as needed. */
export const PRICE_BY_TIER: Record<number, number> = {
    1: 150,
    2: 110,
    3: 80,
    4: 55,
};

export function priceForTier(tier: number) {
    return PRICE_BY_TIER[tier] ?? 50;
}

export function currency(amount: number) {
    return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
