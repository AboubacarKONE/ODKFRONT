import { Observable } from 'rxjs';
import {Log} from './../model/Log';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }
  saveLog(log:Log):Observable<Log>{
    return this.http.post<Log>(`${this.host}/odkConnect/log/saveLog`, log);
  }
  // updateLog(id:number,log:Log):Observable<Log>{
  //   return this.http.put<Log>(`${this.host}/odkConnect/log/updateLog/${id}`, log);
  // }
  findAllLogs():Observable<Log[]>{
    return this.http.get<Log[]>(`${this.host}/odkConnect/log/listLogs`)
  }
}
