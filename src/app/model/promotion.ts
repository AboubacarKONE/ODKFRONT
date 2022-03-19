import { User } from './User';
import { lignePromotion } from "./lignePromotion";

export interface promotion {
 id?:number;
 libelle?:string;
 dateDebut?:Date;
 datefin?:Date
 lignePromotions?:User[];
}