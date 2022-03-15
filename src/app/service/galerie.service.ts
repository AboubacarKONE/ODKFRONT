import { media } from './../model/Media';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalerieService {
  private host = environment.apiUrl

  constructor(private http: HttpClient) {}
  public addNewMedia(formData: FormData): Observable<media> {
    return this.http.post<media>(`${this.host}/odkConnect/media/saveMedia`, formData);
  }
  public findAllByAdminAndFormateur(): Observable<media[]> {
    return this.http.get<media[]>(`${this.host}/odkConnect/media/listMediaByAdminOrFormateur`)
  }
  public findAllByAlum(): Observable<media[]> {
    return this.http.get<media[]>(`${this.host}/odkConnect/media/listMediaByAlum`)
  }
  public findAllMediaByUserId(id:number): Observable<media[]> {
    return this.http.get<media[]>(`${this.host}/odkConnect/media/listMediaByUser/${id}`)
  }

  // public addPhoto(galerie: any, image: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append("photo", image);
  //   return this.http.post(this.server+"/odkConnect/file/ajouter", formData)
  // }

  // public listeMedia(){
  //   return this.http.get(this.server+'/odkConnect/file/listemedia');
  // }

  
}