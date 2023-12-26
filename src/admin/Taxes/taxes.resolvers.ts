import { Resolver } from "@nestjs/graphql";
import { BaseResolver } from "src/customer/utils/base.resolver";
import { DataSource } from "typeorm";
import { Tax } from "./taxes.models";

@Resolver()
export class TaxResolver extends BaseResolver(Tax) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}