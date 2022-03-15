import { promotion } from './promotion';
import { User } from "./User";

export interface lignePromotion{
    id?:number;
    promotion?:promotion;
    user?:User;
}