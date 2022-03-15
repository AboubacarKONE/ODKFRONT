import { CustomHttpRespone } from './../model/custom-http-response';
import { responseForum } from './../model/response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  public addNewResponseForum(formData: FormData): Observable<responseForum> {
    return this.http.post<responseForum>(`${this.host}/odkConnect/forum/response/saveResponseForum`, formData);
  }
  public updateResponse(formData: FormData): Observable<responseForum> {
    return this.http.post<responseForum>(`${this.host}/odkConnect/forum/response/updateResponse`, formData);
  }
  findAllresponseByQuiz(idQuiz:number): Observable<responseForum[]> {
    return this.http.get<responseForum[]>(`${this.host}/odkConnect/forum/response/listResponseForum/${idQuiz}`)
  }
  deleteResponseForm(idResponse: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/odkConnect/forum/response/deleteResponseForum/${idResponse}`);
  }
}
