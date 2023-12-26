import { BaseModel } from "../utils/base.model";
export declare class Banner extends BaseModel {
    name: string;
    banner_media_link: string;
    is_active: boolean;
    banner_type: string;
    expiry_time: Date;
}
