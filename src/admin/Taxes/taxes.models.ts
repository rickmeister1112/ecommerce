import { Entity, Column, ManyToOne } from "typeorm";
import { BaseModel } from "../utils/base.model";

@Entity()
export class Tax extends BaseModel {
  @Column({ type: 'varchar', length: 64, nullable: true })
  tax_name: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  tax_type: number; //1: inter, 2: intra

  @Column({ type: 'float', default: 0.00 })
  tax_rate: number;

  @Column({type: 'float',default: 0.00 })
  CGST: number;

  @Column({type: 'float',default: 0.00 })
  SGST: number;

  @Column({type: 'float',default: 0.00 })
  IGST: number;

  @Column({type: 'float',default: 0.00 })
  CESS: number;

  @Column({type: 'text'})
  zoho_tax_id: string;
}