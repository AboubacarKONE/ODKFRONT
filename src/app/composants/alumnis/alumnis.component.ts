import { lignePromoModel } from './../../model/lignePromoModel';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { NgForm } from '@angular/forms';
import { UserService } from './../../service/user.service';
import { AuthenticationService } from './../../service/authentication.service';
import { PromotionService } from './../../service/promotion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from './../../enum/notification-type.enum';
import { NotificationService } from './../../service/notification.service';
import { Subscription } from 'rxjs';
import { LignePromoService } from './../../service/ligne-promo.service';
import { Component, Input, OnInit, Output, EventEmitter, INJECTOR, Inject } from '@angular/core';
import { User } from 'src/app/model/User';
import { ActivatedRoute } from '@angular/router';
import { lignePromotion } from 'src/app/model/lignePromotion';


@Component({
  selector: 'app-alumnis',
  templateUrl: './alumnis.component.html',
  styleUrls: ['./alumnis.component.scss']
})
export class AlumnisComponent implements OnInit {
  // @Input()
  // public idPromo: number;
  private subscriptions: Subscription[] = [];
  public usersByPromos: User[];
  public refreshing: boolean;
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;
  public editeUser = new User;
  private currentUsername: string;
  public isAdmin: boolean;
  public isFormateur: boolean;
  public isSuperAdmin: boolean;
  public ligPromo = new lignePromoModel;
  constructor(private lignePromoService: LignePromoService, private notificationService: NotificationService, private promoService: PromotionService,
    private authenticationService: AuthenticationService, private userService: UserService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserByPromos(true);
    this.isAdmin = this.authenticationService.isAdmin;
    this.isFormateur = this.authenticationService.isFormateur;
    this.isSuperAdmin = this.authenticationService.isSuperAdmin;
  }
  getUserByPromos(showNotification: boolean) {
    this.subscriptions.push(
      this.lignePromoService.findAllAlumByPromotionId(this.activatedRoute.snapshot.params.id).subscribe(
        (response: User[]) => {
          this.usersByPromos = response;
          if (showNotification) {
            // this.sendNotification(NotificationType.SUCCESS, `${response.length} alumnis chargés avec succès.`)
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
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
    console.log(fileName, profileImage);
  }
  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }
  public onAddNewAlum(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(null, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addAlumni(formData).subscribe(
        (response: User) => {
          const formData = new FormData();
          formData.append('idUser', JSON.stringify(response.id));
          formData.append('idPromo', this.activatedRoute.snapshot.params.id);          
          this.addNewLignePromotion(formData);
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
  public addNewLignePromotion(formData: FormData) {
    this.subscriptions.push(
      this.lignePromoService.saveLignePromo(formData).subscribe(
        (responseLignePromo: lignePromotion) => {
          this.clickButton('new-user-close');
          this.getUserByPromos(false);
          this.fileName = null;
          this.profileImage = null;
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
    console.log(editeUser);

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
          this.getUserByPromos(false);
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
          this.getUserByPromos(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click()
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur s\'est produite. Please try again.');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
