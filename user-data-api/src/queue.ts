import { User } from "./types";
import { getUserFromMock } from "./mockData";

/**
 * Very small queue utility:
 * - push returns a Promise that resolves/rejects when the job finishes.
 * - internal worker concurrency controls how many DB-simulations run in parallel.
 */

type JobResolve = (value: User) => void;
type JobReject = (err: any) => void;

interface Job {
    id: number;
    resolve: JobResolve;
    reject: JobReject;
}

export class SimpleFetchQueue {
    private queue: Job[] = [];
    private concurrency: number;
    private running = 0;

    constructor(concurrency = 3) {
        this.concurrency = concurrency;
    }

    enqueueFetch(id: number): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.queue.push({ id, resolve, reject });
            this.processNext();
        });
    }

    private processNext() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const job = this.queue.shift()!;
            this.running++;
            // simulate DB access (200ms) and resolve/reject accordingly
            this.simulatedDbFetch(job.id)
                .then((user) => job.resolve(user))
                .catch((err) => job.reject(err))
                .finally(() => {
                    this.running--;
                    // continue processing
                    this.processNext();
                });
        }
    }

    // Simulate a database call with 200ms delay
    private simulatedDbFetch(id: number): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            setTimeout(() => {
                const user = getUserFromMock(id);
                if (!user) {
                    reject({ status: 404, message: `User ${id} not found` });
                    return;
                }
                resolve(user);
            }, 200);
        });
    }
}
