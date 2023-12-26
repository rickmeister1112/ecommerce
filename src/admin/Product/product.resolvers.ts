import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { BaseAdminResolver } from '../utils/base.admin.resolver';
import { DataSource } from 'typeorm';
import { TaxSlab, Category, SubCategory, SSubCategory, Product, WarehouseProduct, CollectionReference, Warehouse, CollectionWarehouseProduct, BasePricing, UserSpecificPricing, Pincode, PincodeGroup } from './product.models';
import { ZohoHelper } from '../utils/zoho.helper';

/*
  async hasAddPermission(rows: Recipe[], user?: User) {
    rows.forEach((row, index) => {
      rows[index].user = user;
    });
    return rows;
  }
  
   */

@Resolver()
export class TaxSlabAdminResolver extends BaseAdminResolver(TaxSlab) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
  // @Mutation()
  // async addTaxSlab(@Args('row') row: TaxSlab): Promise<TaxSlab[]> {
  //   try {
  //     const zohoHelper = new ZohoHelper();
  //     const response = await zohoHelper.getTaxes();

  //     if (!response) {
  //       throw new Error('No tax data received');
  //     }

  //     const taxes = response.taxes;

  //     const newSlabs: TaxSlab[] = [];

  //     for (let tax of taxes) {
  //       const taxSlab = new TaxSlab();
  //       taxSlab.tax_id = tax.tax_id;
  //       taxSlab.tax_percentage = tax.tax_percentage;
  //       newSlabs.push(taxSlab);
  //     }

  //     // assuming that dataSource can handle arrays of entities
  //     const savedSlabs = await this.dataSource.save(newSlabs);

  //     return savedSlabs; // you might want to return a specific slab or something else

  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new Error('Duplicate value');
  //     }
  //     throw error;
  //   }
  // }
}
//   async hasAddPermission(rows: User[], user?: User) {
//    if(!user.is_admin){
//     throw new ForbiddenException();
//   }
//     return rows;
//   }


@Resolver()
export class CategoryResolver extends BaseAdminResolver(Category) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }

  @Mutation()
  async deleteCategory(@Args('id', { type: () => String }) id: string): Promise<Category> {
    const categoryToDelete = await this.dataSource.findOne(Category, { where: { id } });

    if (!categoryToDelete) {
      throw new Error(`Category with id: ${id} not found`);
    }

    // Set is_synced to 0 for all associated products
    const productsToUpdate = await this.dataSource.find(Product, { where: { category: categoryToDelete.id } });

    for (let product of productsToUpdate) {
      product.is_synced = 0;
      await this.dataSource.save(product);
    }

    // Remove the category
    await this.dataSource.remove(Category, categoryToDelete);

    return categoryToDelete;
  }
}


@Resolver()
export class SubCategoryResolver extends BaseAdminResolver(SubCategory) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }

  @Mutation()
  async addSubCategory(@Args('row') row: SubCategory): Promise<SubCategory> {
    const associatedCategory = await this.dataSource.findOne(Category, { where: { id: row.category_id } });
    if (!associatedCategory) {
      throw new Error(`Category with id: ${row.category_id} not found`);
    }
    
    const newSubCategory = this.dataSource.create(SubCategory, { 
        ...row, 
        category: associatedCategory 
    });
    
    return await this.dataSource.save(newSubCategory);
    
  }
 
  @Query(returns => [SubCategory])
  async listSubCategory(
    @Args('category_id', { type: () => String, nullable: true }) categoryId: string,
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
    @Args('order_by', { type: () => [String], nullable: true }) order_by: string[] = ['created_at']
  ): Promise<SubCategory[]> {
    const skip = (page - 1) * limit;
    const orderByParsed = this.parseOrderBy(order_by);

    // If categoryId is provided, check if it exists
    if (categoryId) {
      const categoryExists = await this.dataSource.findOne(Category, { where: { id: categoryId } });
      if (!categoryExists) {
        throw new Error(`Category with id: ${categoryId} not found`);
      }
    }

    return await this.dataSource.find(SubCategory, {
      where: categoryId ? { category_id: categoryId } : undefined,
      skip,
      take: limit,
      order: orderByParsed
    });
  }

  private parseOrderBy(orderBy: string[]): { [key: string]: 'ASC' | 'DESC' } {
    let parsed: { [key: string]: 'ASC' | 'DESC' } = {};

    orderBy.forEach(item => {
      let [field, direction] = item.split(':');
      if (!direction) direction = 'ASC';
      parsed[field] = direction.toUpperCase() as 'ASC' | 'DESC';
    });

    return parsed;
  }
}



@Resolver()
export class SSubCategoryResolver extends BaseAdminResolver(SSubCategory) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }

  @Mutation()
  async addSSubCategory(@Args('row') row: SSubCategory): Promise<SSubCategory> {
    // Check if the subcategory exists
    const subCategoryExists = await this.dataSource.findOne(SubCategory, { where: { id: row.sub_category_id } });

    if (!subCategoryExists) {
      throw new Error(`SubCategory with id: ${row.sub_category_id} not found`);
    }

    const newSSubCategory = this.dataSource.create(SSubCategory, { ...row, subCategory: subCategoryExists });
    return await this.dataSource.save(newSSubCategory);
  }
}


@Resolver()
export class ProductResolver extends BaseAdminResolver(Product) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}


@Resolver()
export class WarehouseProductResolver extends BaseAdminResolver(WarehouseProduct) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class CollectionReferenceResolver extends BaseAdminResolver(CollectionReference) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class WarehouseIdsResolver extends BaseAdminResolver(Warehouse){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}


@Resolver()
export class BasePricingResolver extends BaseAdminResolver(BasePricing){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class UserSpecificPricingResolver extends BaseAdminResolver(UserSpecificPricing){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class CollectionWarehouseProductResolver extends BaseAdminResolver(CollectionWarehouseProduct){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class PincodeResolver extends BaseAdminResolver(Pincode){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class PincodeGroupResolver extends BaseAdminResolver(PincodeGroup){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}