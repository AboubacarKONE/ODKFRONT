import { User } from './User';
export interface media{
    id?:number;
    titre?:string;
    photoUrl?:string;  
    date:Date;  
    user?:User;    
}