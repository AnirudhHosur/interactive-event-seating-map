export const metrics = {
    totalRequests: 0,
    totalResponseTimeMs: 0,
    record(durationMs: number) {
        this.totalRequests++;
        this.totalResponseTimeMs += durationMs;
    },
    avgResponseTimeMs(): number {
        return this.totalRequests === 0 ? 0 : this.totalResponseTimeMs / this.totalRequests;
    }
};
