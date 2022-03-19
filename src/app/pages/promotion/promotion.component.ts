import { lignePromoModel } from './../../model/lignePromoModel';
import { LignePromoService } from './../../service/ligne-promo.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/User';
import { NotificationService } from './../../service/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from './../../enum/notification-type.enum';
import { PromotionService } from './../../service/promotion.service';
import { Subject, Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { promotion } from 'src/app/model/promotion';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExcelPromoComponent } from '../excel-promo/excel-promo.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit, OnDestroy {
  pagePromo: number = 1;
  idUser: number;
  login = '';
  email='';

  // public idPromo:number;
  public Formateurs: User[];
  // public formateur :User;
  public search;
  public user: User;
  public Formateur: User[];
  public promoSaved: promotion;
  public ligPromo = new lignePromoModel;
  public isAdmin: boolean;
  public isFormateur: boolean;
  private subscriptions: Subscription[] = [];
  public promos: promotion[];


  ref: DynamicDialogRef | undefined;
  constructor(private promoService: PromotionService,
    private userservice: UserService,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    public dialoService: DialogService,
    private lignePromoService: LignePromoService) { }

  ngOnInit(): void {

    this.getPromos(true);
    // this.getFormateursByPromos(true);
    this.getFormateurs();
    this.user = this.authenticationService.getUserFromLocalCache();
    this.isAdmin = this.authenticationService.isAdmin;
    this.isFormateur = this.authenticationService.isFormateur;
  }

  UpdateProfileImage() {
    this.clickButton('profile-image-input')
  }
  // clickButton(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }
  getPromos(showNotification: boolean) {
    this.subscriptions.push(
      this.promoService.getPromotions().subscribe(
        (response: promotion[]) => {
          this.promos = response;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} promotions chargés avec succès.`)
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  // filtrerFormateur(): void {
  //   if (this.login == null) {
  //     this.getFormateurs();
  //   }
  //   this.Formateur = this.Formateur.filter(art => art.login?.includes(this.login));
  //   console.log(this.Formateur);
    
  // }
  selectFormateurClick() { }
  ajouterLigneFormateur() { }
  // getUserById(id:number){
  //  this.subscriptions.push(
  //   this.userService.getUsersById(id).subscribe(
  //     (responseUser:User)=>{
  //         this.formateur = responseUser;
  //         // console.log(form);

  //         this.ligPromo.user =this.formateur;
  //     },
  //     (errorResponse: HttpErrorResponse) => {
  //       this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //     }
  //   ) 
  //  )
  // }
  onaddNewPromotion(promoForm: promotion) {
    // console.log(this.idUser);    
    this.subscriptions.push(
      this.promoService.savePromotion(promoForm).subscribe(
        (response: promotion) => {
          this.clickButton('new-promo-close')
          this.sendNotification(NotificationType.SUCCESS, `${response.libelle} ajout effectué avec succès`)
          this.ligPromo.promotion = response;
          // this.getUserById(this.idUser)
          // // this.ligPromo.user = this.formateur;
          // console.log(this.ligPromo);          
          // this.ligPromoService.saveLignePromo(this.ligPromo).subscribe(
          //   (responsePromo: lignePromotion) => {
          //    
          //   },
          //   (errorResponse: HttpErrorResponse) => {
          //     this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          //   }
          // )
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    )
  }
  saveNewPromotion() {
    this.clickButton('new-promo-save')
  }
  getFormateursByPromos(idPromo: number) {
    this.subscriptions.push(
      this.lignePromoService.findAllFormateurByPromotionId(idPromo).subscribe(
        (response: User[]) => {
          this.Formateurs = response;
          console.log(this.Formateurs);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  public getFormateurs(): void {
    this.subscriptions.push(
      this.userservice.getUsersByRole('ROLE_FORMATEUR').subscribe(
        (response: User[]) => {
          this.Formateur = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
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
  showExcel(id) {
    this.userservice.setIdAlumis(id);
    this.ref = this.dialoService.open(ExcelPromoComponent, {
      header: 'Ajouter une liste d\'alumnis',
      width: '80%',
      // contentStyle: {"max-height": "500px", "overflow": "auto"},
      // baseZIndex: 10000
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
