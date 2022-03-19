import { promotion } from './../model/promotion';
import { CustomHttpRespone } from './../model/custom-http-response';
import { lignePromotion } from './../model/lignePromotion';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class LignePromoService {

  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  getLignePromotions(): Observable<lignePromotion[]> {
    return this.http.get<lignePromotion[]>(`${this.host}/odkConnect/lignePromo/lignePromos`)
  }
  saveLignePromo(formData:FormData):Observable<lignePromotion>{
    return this.http.post<lignePromotion>(`${this.host}/odkConnect/lignePromo/saveLignePromo`,formData)
  }
  getLignePromotionById(idLignePromo?:number):Observable<lignePromotion>{
    return this.http.get<lignePromotion>(`${this.host}/odkConnect/lignePromo/lignePromotions/${idLignePromo}`);
  }
  findAllPromotionByUserId(idUser?:number): Observable<promotion[]> {
    return this.http.get<promotion[]>(`${this.host}/odkConnect/lignePromo/promotion/lignePromotions/${idUser}`)
  }
  findAllUserByPromotionId(idPromo?:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/lignePromo/user/lignePromotions/${idPromo}`)
  }
  findAllAlumByPromotionId(idPromo?:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/lignePromo/Alumni/lignePromotions/${idPromo}`)
  }
  findAllFormateurByPromotionId(idPromo?:number): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/lignePromo/Formateur/lignePromotions/${idPromo}`)
  }
  // updateLignePromotion(idLignePromo:number,idPromo:number,idUser:number):Observable<lignePromotion>{
  //   return this.http.post<lignePromotion>(`${this.host}/odkConnect/lignePromo/updateLignePromo/${idLignePromo}/${idPromo}/${idUser}`);
  // }
}
