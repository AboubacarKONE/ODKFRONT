import { Audit } from './abstract';
import { User } from './User';
export interface categoryForum {
    id?:number;
    libelleCat?:string;
    photoUrl?:string;
    user?:User;
}