import { Job } from 'bull';
import { EntityManager } from 'typeorm';
export declare class OrderProcessor {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    handleOrder(job: Job): Promise<{
        status: string;
        orderId: string;
        message: string;
    } | {
        status: string;
        error: any;
    }>;
}
