/// <reference types="node" />
import { BasePricing } from '../../admin/Product/product.models';
import { UserSpecificPricing } from '../../admin/Product/product.models';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
export declare class ProductSlabsResolver {
    private basePricingRepository;
    private userSpecificPricingRepository;
    constructor(basePricingRepository: Repository<BasePricing>, userSpecificPricingRepository: Repository<UserSpecificPricing>);
    getProductPricing(productWarehouseIds: [UUID], userId: UUID): Promise<BasePricing[]>;
}
