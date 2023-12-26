import { Resolver } from "@nestjs/graphql";
import { DataSource } from "typeorm";
import { WarehouseProduct, CollectionReference, Warehouse } from "../Product/product.models";
import { BaseAdminResolver } from "../utils/base.admin.resolver";
import { Slot, DefaultShipping, Shipping } from "./shipping.models";

@Resolver()
export class SlotResolver extends BaseAdminResolver(Slot) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class DefaultShippingResolver extends BaseAdminResolver(DefaultShipping) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class ShippingResolver extends BaseAdminResolver(Shipping){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}