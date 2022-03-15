import { CustomHttpRespone } from './../model/custom-http-response';
import { categoryForum } from './../model/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryForumService {
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  public addNewCatForum(formData: FormData): Observable<categoryForum> {
    return this.http.post<categoryForum>(`${this.host}/odkConnect/forum/category/SaveCategoryFroum`, formData);
  }
  getAllCategoryForum(): Observable<categoryForum[]> {
    return this.http.get<categoryForum[]>(`${this.host}/odkConnect/forum/category/listCateForum`)
  }
  deleteCatForm(idCat: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/odkConnect/forum/category/deleteCatForum/${idCat}`);
  }
}
