import { ChangerModp } from './../model/changerMdp';
import { User } from './../model/User';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;
  public search:any;
  idAlumnis: any
  image: any;

  constructor(private http: HttpClient) { }
  
  setIdAlumis(data: any){this.idAlumnis = data}
  getIdAlumnis(){return this.idAlumnis}

  setImage(data: any){this.image = data}
  getImage(){return this.image}

  addlignepromo(userPromo: any) {
    throw new Error('Method not implemented.');
  }
  ajoutAlumiExcel(alumnis: any) {
    return this.http.post(`${this.host}/odkConnect/user/many/alumni/save`, alumnis);
  }
  addUserPromo(lignePromo: any) {
    return this.http.post(`${this.host}/odkConnect/lignePromo/ajouteruserpromo`, lignePromo);
  }
 
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/user/listUsers`)
  }
  getUsersByRole(role:string): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/user/listUsersByRole/${role}`)
  }
  getUsersByEmail(email:string): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/odkConnect/user/listUsersByRole/${email}`)
  }
  getUsersById(id:number): Observable<User> {
    return this.http.get<User>(`${this.host}/odkConnect/user/findUserById/${id}`)
  }
  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/odkConnect/user/saveUser`, formData);
  }
  public addAlumni(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/odkConnect/user/saveAlumni`, formData);
  }
  
  updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/odkConnect/user/updateUser`, formData);
  }
  updateAlumni(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/odkConnect/user/updateAlumni`, formData);
  }
  resetPassord(email: string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/odkConnect/user/resetpassword/${email}`);
  }
  subscribeUserByEmail(email:string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/odkConnect/user/subscribeUserByEmail/${email}`);
  }
  subscribeAlumniByEmail(email:string): Observable<CustomHttpRespone> {
    return this.http.get<CustomHttpRespone>(`${this.host}/odkConnect/user/subscribeAlumByEmail/${email}`);
  }
  updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/odkConnect/user/updateProfileImage`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  updatePassword(user:ChangerModp):Observable<User>{
    return this.http.post<User>(`${this.host}/odkConnect/user/update/password`,user);
  }
  deleteUser(user: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/odkConnect/user/delete/${user}`);
  }
  addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }
  getUsersFromLocalCache(): User[] | null {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') || '{}');
    }
    return null;
  }
  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('prenom', user.prenom);
    formData.append('nom', user.nom);
    formData.append('login', user.login);
    formData.append('email', user.email);
    formData.append('adresse', user.adresse);
    formData.append('telephone', user.telephone);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.nonLocked));
    formData.append('profession', user.profession);
    return formData;
  }
}
