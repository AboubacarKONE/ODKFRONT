import { AuthenticationService } from './../../service/authentication.service';
import { User } from './../../model/User';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { FileUploadStatus } from 'src/app/model/file-upload-status';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User;
  public refreshing: boolean;
  private currentUsername: string;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public fileStatus = new FileUploadStatus();
  public isAdmin: boolean;
  public isFormateur: boolean;
  constructor(private authenticationService: AuthenticationService, private userService: UserService,
    private notificationService: NotificationService, private router: Router) { }
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache(); 
    this.isAdmin = this.authenticationService.isAdmin;
    this.isFormateur = this.authenticationService.isFormateur;
  }
  public onUpdateProfileImage():void { 
    const formData = new FormData();
    formData.append('username', this.user.login);
    formData.append('profileImage', this.profileImage )
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>)=>{
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse)=>{
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  }
  private reportUploadProgress(event: HttpEvent<any>) {
    switch(event.type){
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if(event.status === 200){
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${ new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS,`image de profile de ${event.body.prenom} mis à jour avec succès`);
          this.fileStatus.status = 'done';
          break;
        }else{
          this.sendNotification(NotificationType.ERROR, `impossible de relancer l'image de chargement. réesssayer`);
          break;
        }
        default:
          `tous les processus terminé`
    }
    
  }
  public onUpdateCurrentUser(user: User): void {   
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().login;
    const formData = this.userService.createUserFormData(this.currentUsername, user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} update successfully`)
          this.refreshing = false
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.SUCCESS, errorResponse.error.message);
          this.refreshing = false;
          this.profileImage = null;
        }
      )
    )
  }
  public UpdateProfileImage(){
    this.clickButton('profile-image-input')
  }
  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
    console.log(fileName, profileImage);
  }
  onLogOut() {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `Vous êtes déconnecté avec succès`);
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur s\'est produite. Please try again.');
    }
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click()
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
