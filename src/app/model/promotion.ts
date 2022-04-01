import { User } from './User';
import { lignePromotion } from "./lignePromotion";
import { Audit } from './abstract';

export interface promotion  {
 id?:number;
 libelle?:string;
 dateDebut?:Date;
 datefin?:Date
 lignePromotions?:lignePromotion[];
}