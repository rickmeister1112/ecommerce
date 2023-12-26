import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { Warehouse, PincodeGroup } from '../Product/product.models';



@Entity()
export class Slot extends BaseModel{

    @Column({ type: 'varchar' })
    slotName: string;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;
} 


@Entity()
export class DefaultShipping extends BaseModel {

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    orderValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;
}

@Entity()
export class Shipping extends BaseModel {

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    orderValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouse_id' }) // Foreign key for Warehouse
    warehouse: Warehouse;

    @Column({ type: 'uuid' })
    warehouse_id: string; // Assuming you're using string UUIDs

    @ManyToOne(() => PincodeGroup, group => group.shipping)
    pincodeGroup: PincodeGroup;
}
