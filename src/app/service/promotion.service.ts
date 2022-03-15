import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { promotion } from '../model/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  getPromotions(): Observable<promotion[]> {
    return this.http.get<promotion[]>(`${this.host}/odkConnect/promotion/promotions`)
  }
  savePromotion(promo:promotion):Observable<promotion>{
    return this.http.post<promotion>(`${this.host}/odkConnect/promotion/savePromo`,promo)
  }
  getPromotionById(id:number):Observable<promotion>{
    return this.http.get<promotion>(`${this.host}/odkConnect/promotion/promoById/${id}`);
  }
  updatePromotion(id:number,promo:promotion):Observable<promotion>{
    return this.http.post<promotion>(`${this.host}/odkConnect/promotion/updatePromo/${id}`,promo)
  }
  // updateUserByPromotion(idPromo:number,idLignePromo:number,idUser:number):Observable<promotion>{
  //   return this.http.patch<promotion>(`${this.host}/odkConnect/promotion/promotions/update/user/${idPromo}/${idLignePromo}/${idUser}`);
  // }
}

