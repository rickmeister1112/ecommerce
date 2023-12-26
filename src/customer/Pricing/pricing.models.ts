import {Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UserWarehouseInput {
    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    warehouseId: string;
}



@InputType()
export class ProductPricingInput {
     @Field()
    userId: string;

     @Field()
    productWarehouseIds: string[];
}



/* 
@TODO
1.) check the input types and add more functionality to it
*/