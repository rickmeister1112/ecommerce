
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { BasePricing } from '../../admin/Product/product.models';
import { UserSpecificPricing } from '../../admin/Product/product.models';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { ProductPricingInput, UserWarehouseInput } from './pricing.models';
import { UUID } from 'crypto';

@Resolver()
export class ProductSlabsResolver {
    constructor(
        @InjectRepository(BasePricing)
        private basePricingRepository: Repository<BasePricing>,
        @InjectRepository(UserSpecificPricing)
        private userSpecificPricingRepository: Repository<UserSpecificPricing>,
    ) { }
     // NOTE: do not remove the code
    // async getProductSlabs(@Args('input') input: UserWarehouseInput) {
    //     const { userId, warehouseId } = input;

    //     // Create a hashmap for productId vs slabPrices
    //     const productSlabMap = new Map<string, number[]>();

    //     // Get data from BasePricing
    //     const basePricings = await this.basePricingRepository.find();
    //     basePricings.forEach(bp => {
    //         if (!productSlabMap.has(bp.product_warehouse_id)) {
    //             productSlabMap.set(bp.product_warehouse_id, []);
    //         }
    //         productSlabMap.get(bp.product_warehouse_id).push(bp.slab_price);
    //     });
    //     //console.log("line 143", basePricings);
    //     // Get data from UserSpecificPricing
    //     const userSpecificPricings = await this.userSpecificPricingRepository.find({
    //         where: {
    //             user_id: userId,
    //             warehouse_id: warehouseId,
    //         },
    //     });
    //     //console.log("line 157", userSpecificPricings);
    //     // Update or replace slab prices based on UserSpecificPricing
    //     // userSpecificPricings.forEach(usp => {
    //     //     // Check if the product_warehouse_id exists in the map
    //     //     if (productSlabMap.has(usp.product_warehouse_id)) {
    //     //         // Replace the existing slab prices with UserSpecificPricing slab price
    //     //         productSlabMap.set(usp.product_warehouse_id, [usp.slab_price]);
    //     //     }
    //     // });

    //     // // Convert the map to the desired output format
    //     // return Array.from(productSlabMap, ([productId, slabPrices]) => ({ productId, slabPrices }));
    //     // Create a temporary map to hold UserSpecificPricing slab prices
    //     const userSpecificPricesMap = new Map<string, number[]>();

    //     // Collect slab prices from UserSpecificPricing
    //     userSpecificPricings.forEach(usp => {
    //         let prices = userSpecificPricesMap.get(usp.product_warehouse_id) || [];
    //         prices.push(usp.slab_price);
    //         userSpecificPricesMap.set(usp.product_warehouse_id, prices);
    //     });

    //     // Update productSlabMap with UserSpecificPricing data
    //     userSpecificPricesMap.forEach((prices, productWarehouseId) => {
    //         productSlabMap.set(productWarehouseId, prices);
    //     });
    //     console.log("line number 183",userSpecificPricesMap);
    //     // Convert the map to the desired output format
    //     console.log("line number 185",productSlabMap);
    //     return Array.from(productSlabMap, ([productId, slabPrices]) => ({ productId, slabPrices }));

    // }


    @Mutation(() => [BasePricing])
    async getProductPricing(@Args('productWarehouseIds') productWarehouseIds: [UUID],@Args('userId') userId: UUID ): Promise<BasePricing[]> {
       // const { userId, productWarehouseIds } = input;
    
        // Search in UserSpecificPricing for all productWarehouseIds
        const userSpecificPricings = await this.userSpecificPricingRepository.find({
            where: {
                user_id: userId,
                product_warehouse_id: In(productWarehouseIds),
                is_active: true,
                sale_start: LessThan(new Date()),
                sale_ended: MoreThan(new Date())
            },
            relations: ['productWarehouse', 'productWarehouse.product']
        });
    
        // Filter out the found productWarehouseIds
        const foundIds = userSpecificPricings.map(usp => usp.product_warehouse_id);
        const remainingIds = productWarehouseIds.filter(id => !foundIds.includes(id));
    
        // Search in BasePricing for the remaining productWarehouseIds
        const basePricings = await this.basePricingRepository.find({
            where: {
                product_warehouse_id: In(remainingIds),
                is_active: true
            },
            relations: ['productWarehouse', 'productWarehouse.product']
        });
    
        // Combine results and transform to BasePricing
        const combinedPricings = [...userSpecificPricings, ...basePricings];
        if (combinedPricings.length === 0) {
            throw new Error("Product pricing not found");
        }
    
        return combinedPricings.map(pricing => transformToBasePricing(pricing));
    }
    


}
function transformToBasePricing(pricing: UserSpecificPricing | BasePricing): BasePricing {
    return {
        id: pricing.id,
        created_at: pricing.created_at,
        updated_at: pricing.updated_at,
        product_warehouse_id: pricing.product_warehouse_id,
        slab_price: pricing.slab_price,
        min_qty: pricing.min_qty,
        total_quantity_for_sale: (pricing as BasePricing).total_quantity_for_sale ?? 0,
        total_quantity_user: (pricing as BasePricing).total_quantity_user ?? 0,
        is_sale: (pricing as BasePricing).is_sale ?? false,
        is_default: (pricing as BasePricing).is_default ?? false,
        is_active: pricing.is_active,
        productWarehouse: pricing.productWarehouse,
    };
}
