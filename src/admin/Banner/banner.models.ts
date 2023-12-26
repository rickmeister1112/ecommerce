import { Entity, Column } from "typeorm";
import { BaseModel } from "../utils/base.model";

@Entity()
export class Banner extends BaseModel {
    @Column({ type: "text" })
    name: string;

    @Column({ type: "text" })
    banner_media_link: string;

    @Column({ type: "boolean" })
    is_active: boolean;

    @Column({ type: "text" })
    banner_type: string;// 1: pop banner , 2 homescreen

    @Column({ type: 'timestamptz', nullable: true })
    expiry_time: Date;
}
