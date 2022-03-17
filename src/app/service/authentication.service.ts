import { User } from './../model/User';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Role } from '../enum/Role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private token:any;
  private loggedInUsername:any;
  private JwtHelper = new JwtHelperService();
  private isLogged :any;
  constructor(private http:HttpClient) { }
  login(user:User):Observable<HttpResponse<User>>{
    return this.http.post<User>(`${this.host}/odkConnect/user/login`, user, {observe:'response'});
  }
  registerUser(user:User):Observable<User>{
    return this.http.post<User>
    (`${this.host}/odkConnect/user/registerUser`,user);
  }
  registerAlumni(user:User):Observable<User>{
    return this.http.post<User>
    (`${this.host}/odkConnect/user/registerAlumni`,user);
  }
  logOut():void{
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }
  saveToken(token:string):void{
    this.token = token;
    localStorage.setItem('token', token);
  }
  addUserToLocalCache(user: User):void{
    localStorage.setItem('user', JSON.stringify(user));
  }
  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  loadToken():void{
    this.token= localStorage.getItem('token')
  }
  getToken():String{
    return this.token;
  }
  public isUserloggedIn(): boolean{
    this.loadToken();
    if(this.token != null && this.token !== ''){
      if(this.JwtHelper.decodeToken(this.token).sub !=null || ''){
        if(!this.JwtHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.JwtHelper.decodeToken(this.token).sub;          
          this.isLogged = true;
        }       
      }
    }
    else{
      this.logOut();
      this.isLogged = false;
    }
    return this.isLogged;
  }
  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isFormateur(): boolean {
    return this.isAdmin || this.getUserRole() === Role.FORMATEUR;
  }
  public get isAlumni(): boolean {
    return this.getUserRole() === Role.ALUMNI;
  }
  public get isAdminOrFormateur(): boolean {
    return this.isAdmin || this.isFormateur
  }
  private getUserRole(): String {
    return this.getUserFromLocalCache().role;
  }
}
