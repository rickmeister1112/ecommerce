import { Resolver } from "@nestjs/graphql";
import { DataSource } from "typeorm";
import { BaseAdminResolver } from "../utils/base.admin.resolver";
import { Banner } from "./banner.models";



@Resolver()
export class BannerResolver extends BaseAdminResolver(Banner){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}