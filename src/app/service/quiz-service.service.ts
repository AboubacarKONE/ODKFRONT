import { CustomHttpRespone } from './../model/custom-http-response';
import { quizForum } from './../model/quiz';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  public addNewQuizForum(formData: FormData): Observable<quizForum> {
    return this.http.post<quizForum>(`${this.host}/odkConnect/forum/quiz/saveQuizForum`, formData);
  }
  public updateQuiz(formData: FormData): Observable<quizForum> {
    return this.http.post<quizForum>(`${this.host}/odkConnect/forum/quiz/updateQuiz`, formData);
  }
  getAllQuizForum(): Observable<quizForum[]> {
    return this.http.get<quizForum[]>(`${this.host}/odkConnect/forum/quiz/listQuizForum`)
  }
  findAllQuizByCategorie(idCat:number): Observable<quizForum[]> {
    return this.http.get<quizForum[]>(`${this.host}/odkConnect/forum/quiz/listQuizForum/${idCat}`)
  }
  deleteQuizForm(idQuiz: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/odkConnect/forum/quiz/deleteQuizForum/${idQuiz}`);
  }
}
