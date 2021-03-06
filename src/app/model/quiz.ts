import { categoryForum } from 'src/app/model/category';
import { Audit } from './abstract';
import { responseForum } from './response';
import { User } from './User';
export interface quizForum {
    id?:number;
    description?:string;
    photoUrl?:string;
    categoryForum?:categoryForum;
    user?:User;    
}