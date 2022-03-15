import { HeaderComponent } from './../../composants/header/header.component';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { NotificationService } from './../../service/notification.service';
import { UserService } from './../../service/user.service';
import { Subscription } from 'rxjs';
import { User } from './../../model/User';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from 'src/app/model/custom-http-response';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/Role.enum';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-administrateurs',
  templateUrl: './administrateurs.component.html',
  styleUrls: ['./administrateurs.component.scss']
})
export class AdministrateursComponent implements OnInit, OnDestroy {
   // private subs = new SubSink()
  pageFormateur:number = 1;  
  pageAdmin:number = 1;
  pageSuperAdmin:number = 1;   
  public users: User[];
  public Admin: User[];
  public Formateur: User[];
  public SuperAdmin: User[];
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;
  public editeUser = new User;
  private currentUsername: string;
  public isAdmin: boolean;
  public isFormateur: boolean;
  public isSuperAdmin: boolean;
  constructor(private authenticationService: AuthenticationService, private userService: UserService, private notificationService: NotificationService) { }



  ngOnInit(): void {
    this.getAdministrateurs(true);
    this.getFormateurs(true);
    this.getSuperAdministrateurs(true);
    this.isAdmin = this.authenticationService.isAdmin;
    this.isFormateur = this.authenticationService.isFormateur;
    this.isSuperAdmin = this.authenticationService.isSuperAdmin;
  }
  public getSuperAdministrateurs(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsersByRole('ROLE_SUPER_ADMIN').subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.SuperAdmin = response;          
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} super-administrateurs chargés avec succès.`)
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false
        }
      )
    );
  }
  public getAdministrateurs(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsersByRole('ROLE_ADMIN').subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.Admin = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} adminstrateurs chargés avec succès.`)
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false
        }
      )
    );
  }
  public getFormateurs(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsersByRole('ROLE_FORMATEUR').subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.Formateur = response;         
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} formateurs chargés avec succès.`)
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false
        }
      )
    );
  }

  public onSelectUsers(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }
  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
    // console.log(fileName, profileImage);
  }
  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }
  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(null, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getAdministrateurs(false);          
          this.fileName = null;
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} Ajout effectuer avec succès`)
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    )
  }
  public onEditUser(editeUser: User) {
    this.editeUser = editeUser;
    // console.log(editeUser);
    this.currentUsername = editeUser.login;
    this.clickButton('openUserEdit');
  }
  public onUpdateUser(): void {
    const formData = this.userService.createUserFormData(this.currentUsername, this.editeUser, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          // console.log(response.role.substring(5));          
          this.getAdministrateurs(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.prenom} ${response.nom} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
  }
  onDeleteUser(user: string) {
    this.subscriptions.push(
      this.userService.deleteUser(user).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getAdministrateurs(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  // pageChange(event){
  //   console.log(event);
  //   this.pageFormateur= event;
  // }
 
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
