import { audit } from 'src/app/enum/audit';
import { LogService } from './../../service/log.service';
import { Log } from './../../model/Log';
import { promotionModel } from './../../model/promotionModel';
import { lignePromotion } from './../../model/lignePromotion';
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
  email = '';
  public idLignePromo: number;
  public idPromo: number;
  public Formateurs: User[];
  // public formateur :User;
  public search;
  public searchAnotherformateur;
  public user: User;
  public formateurNot:User[] = [];
  public Formateur: User[];
  public editPromo = new promotionModel;
  public promoSaved: promotion;
  public selectedUser: User;
  public log = new Log;
  // public ligPromoFormateur:promotion;
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
    private lignePromoService: LignePromoService,
    private logService:LogService
   ) { }

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
  getPromos(showNotification?: boolean) {
    this.subscriptions.push(
      this.promoService.getPromotions().subscribe(
        (response: promotion[]) => {
          this.promos = response;        
          // this.auditService.promotionAudit = this.promos;
          this.promos.forEach(pr => {
            this.lignePromoService.findAllFormateurByPromotionId(pr.id).subscribe(
              (ligneFormateur: lignePromotion[]) => {
                pr.lignePromotions = ligneFormateur;
                // console.log(pr.lignePromotions);
              })
          })
          this.promos.forEach(p=>{
            // this.auditService.listAudit.push(p)
          })
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
  public onSelectLignePromotion(selectedLigPromo: lignePromotion): void {
    this.idLignePromo = selectedLigPromo.id
    this.idPromo = selectedLigPromo.promotion.id
    this.selectedUser = selectedLigPromo.user;
    // console.log(this.selectedUser);    
    this.clickButton('openUserInfo');
  }
  AffecterFormateur(form: User) {
    const formData = new FormData();
    formData.append('idUser', JSON.stringify(form.id));
    formData.append('idPromo', JSON.stringify(this.idPromo));
    this.addNewLignePromotion(formData);
  }
  reassignFormateur(reform: User) {
    this.formateurNot = [];
    const formData = new FormData();
    formData.append('idLignePromo', JSON.stringify(this.idLignePromo));
    formData.append('idPromo', JSON.stringify(this.idPromo));
    formData.append('idUser', JSON.stringify(reform.id));
    this.subscriptions.push(
      this.lignePromoService.updateLignePromotion(formData).subscribe(
        (response: lignePromotion) => {
          this.sendNotification(NotificationType.SUCCESS, `${response?.user.prenom} réaffectés à ${response?.promotion.libelle} avec succès`);
          
          this.getPromos()
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  onfindFormateurByPromoNot(user:User){
    this.Formateur.forEach(f=>{
      if(f.id !== user.id){
        this.formateurNot.push(f);
        // console.log(this.formateurNot);        
      }
    })
    // this.subscriptions.push(
    //   this.lignePromoService.findAllFormateurByPromotionIdNot(this.idPromo).subscribe(
    //     (response: User[]) => {
    //       this.formateurNot = response;
    //       console.log(this.formateurNot);
          
    //       // this.sendNotification(NotificationType.SUCCESS, `${response?.user.prenom} réaffectés à ${response?.promotion.libelle} avec succès`);
    //       this.getPromos()
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
    //     }
    //   )
    // )
  }
  public addNewLignePromotion(formData: FormData) {
    this.subscriptions.push(
      this.lignePromoService.saveLignePromo(formData).subscribe(
        (responseLignePromo: lignePromotion) => {
          this.sendNotification(NotificationType.SUCCESS, `${responseLignePromo?.user.prenom} affectés à ${responseLignePromo?.promotion.libelle} avec succès`);
          this.getPromos()
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  onUpdatePromotion(){

  }
  onEditPromo(editPromo: promotionModel){
    this.editPromo = editPromo;
    console.log(this.editPromo);    
    this.clickButton('openPromoEdit')
  }
  onaddNewPromotion(promoForm: promotion) {
    // console.log(this.idUser);    
    this.subscriptions.push(
      this.promoService.savePromotion(promoForm).subscribe(
        (response: promotion) => {
          this.log.action = `ajout de ${response.libelle}`;
          this.log.tableName =audit.AJOUTER
          this.log.createdBy = this.user;              
          this.logService.saveLog(this.log).subscribe(
          (audit: Log) => { 
            this.clickButton('new-promo-close')
            this.sendNotification(NotificationType.SUCCESS, `${response.libelle} ajout effectué avec succès`)
          });
         
          // this.ligPromo.promotion = response;
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

  onGetpromoId(id: number) {
    this.idPromo = id;
    // console.log(this.idPromo);
  }
  saveNewPromotion() {
    this.clickButton('new-promo-save')
  }
  // getFormateursByPromos(idPromo: number) {
  //   this.subscriptions.push(
  //     this.lignePromoService.findAllFormateurByPromotionId(idPromo).subscribe(
  //       (response: User[]) => {
  //         this.Formateurs = response;
  //         this.Formateurs.forEach(fr => {
  //           // this.promos.forEach()
  //         })
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
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
