import { audit } from 'src/app/enum/audit';
import { LogService } from './../../service/log.service';
import { Log } from './../../model/Log';
import { PromotionService } from './../../service/promotion.service';
import { Audit } from 'src/app/model/Audit';
import { CategoryForumService } from './../../service/category-forum.service';
import { ResponseService } from './../../service/response.service';
import { QuizServiceService } from './../../service/quiz-service.service';
import { categoryForum } from 'src/app/model/category';
import { promotion } from 'src/app/model/promotion';
import { quizForum } from 'src/app/model/quiz';
import { responseForum } from './../../model/response';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { media } from 'src/app/model/Media';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { GalerieService } from 'src/app/service/galerie.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { ViewimageComponent } from 'src/app/viewimage/viewimage.component';



@Component({
  selector: 'app-page-statistiques',
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {
  public pageAudit: number = 1;
  public isAdmin: boolean;
  public isFormateur: boolean;
  public isAlumni: boolean;
  public isAdminOrFormateur: boolean;
  public user: User;
  pageAlumnigalerie: number = 1;
  public mediaAdminOrFormateur: media[];
  public mediaAlum: media[];
  public mediaByUser: media[];
  public fileName: string;
  public profileImage: File;
  public log = new Log;
  public listAudit: Log[];
  // public auditTrie:Audit[]=[];
  // public userAudit: User[];
  // public responseAudit: responseForum[];
  // public quizAudit: quizForum[];
  // public promotionAudit: promotion[];
  // public mediaAudit: media[];
  // public categoryAudit: categoryForum[];
  private subscriptions: Subscription[] = [];
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];

  nbreAdmin: any;
  nbreAlumni: any;
  nbreFormateur: any;
  nbrePromo: any;

  admin: any = [];
  alumni: any = [];
  formateur: any = [];
  promo: any = [];

  adminstat: any = [];
  alumnistat: any = [];
  formateurstat: any = [];

  pieChartOptions: ChartOptions
  pieChartLabels: Label[]
  pieChartData: SingleDataSet
  pieChartType: ChartType
  pieChartLegend = true;
  pieChartPlugins: any

  ref: DynamicDialogRef | undefined;

  constructor(public userService: UserService,
    private authenticationService: AuthenticationService,
    public galerieService: GalerieService,
    private notificationService: NotificationService,
    public dialoService: DialogService, private logService:LogService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.isFormateur = this.authenticationService.isFormateur;
    this.isAdmin = this.authenticationService.isAdmin;
    this.isAlumni = this.authenticationService.isAlumni;
    this.isAdminOrFormateur = this.authenticationService.isAdminOrFormateur;
    this.userService.getUsers().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {

        if (data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN") {
          this.admin.push(data[i]);
        }

        if (data[i].role == "ROLE_ALUM") {
          this.alumni.push(data[i]);
        }

        if (data[i].role == "ROLE_FORMATEUR") {
          this.formateur.push(data[i]);
        }

      }
      this.nbreAdmin = this.admin.length;
      this.nbreAlumni = this.alumni.length;
      this.nbreFormateur = this.formateur.length;
    })

    this.getGraphe();
    this.user = this.authenticationService.getUserFromLocalCache();
    this.findAllByAdminAndFormateur();
    this.findAllMediaByUserId();
    this.getAllLogs();
  }
  // findAllByAlum() {
  //   this.subscriptions.push(
  //     this.galerieService.findAllByAlum().subscribe(
  //       (response: media[]) => {
  //         this.mediaAlum = response;
  //         // console.log(this.mediaAlum);          
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
  findAllMediaByUserId() {
    this.subscriptions.push(
      this.galerieService.findAllMediaByUserId(this.user.id).subscribe(
        (response: media[]) => {
          this.mediaByUser = response;
          // console.log("content media", this.mediaByUser);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }


  findAllByAdminAndFormateur() {
    this.subscriptions.push(
      this.galerieService.findAllByAdminAndFormateur().subscribe(
        (response: media[]) => {
          this.mediaAdminOrFormateur = response;
          // console.log(this.mediaAdminOrFormateur);          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  onScroll() {
    console.log('scrolled');

  }


  onNewMediaForum(mediaForm: NgForm) {
    if (this.profileImage == null) {
      this.sendNotification(NotificationType.ERROR, `VEUILLEZ SELECTIONNER UN MEDIA`)
    }
    if (mediaForm.value.titre) {
      const formData = new FormData();
      formData.append('titre', mediaForm.value.titre);
      formData.append('idUser', JSON.stringify(this.user.id));
      formData.append('mediaImage', this.profileImage);
      // console.log(formData);
      this.subscriptions.push(
        this.galerieService.addNewMedia(formData).subscribe(
          (response: media) => {
            this.log.action= `Ajout de l'activité ${response.titre.substring(0,50)}`;
          this.log.tableName = audit.AJOUTER
          this.log.createdBy = this.user;                 
          this.logService.saveLog(this.log).subscribe(
            (audit: Log) => {
              this.clickButton('new-media-close');
              this.fileName = null;
              this.profileImage = null;
              mediaForm.reset();
              this.sendNotification(NotificationType.SUCCESS, `MEDIA AJOUTEE AVEC SUCCES`)
              this.findAllByAdminAndFormateur();
            });
        
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            this.profileImage = null;
          }
        )
      )
    } else if (!mediaForm.value.titre) {

      this.sendNotification(NotificationType.ERROR, `Veuillez entrer une description pour l'activité `)
    }

  }
  public getAllLogs(): void {
    this.subscriptions.push(
      this.logService.findAllLogs(). subscribe(
        (response: Log[]) => { 
          this.listAudit = response;
        // console.log(this.listAudit)
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  // public getQuizForums() {
  //   this.subscriptions.push(
  //     this.quizService.getAllQuizForum().subscribe(
  //       (response: Audit[]) => {
  //         // this.quizForum = response;
  //         // this.auditService.quizAudit = this.quizForum;
  //         response.forEach(q => {
  //           this.listAudit.push(q)
  //         })
  //         // console.log(this.quizForum);
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
  // public getCategoryForums() {
  //   this.subscriptions.push(
  //     this.catForumService.getAllCategoryForum().subscribe(
  //       (response: Audit[]) => {
  //         // this.cateForum = response;
  //         // this.auditService.categoryAudit = this.cateForum;
  //         response.forEach(c => {
  //           this.listAudit.push(c)
  //         })
  //         // console.log( this.auditService.listAudit);          
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
  // getPromos() {
  //   this.subscriptions.push(
  //     this.promoService.getPromotions().subscribe(
  //       (response: Audit[]) => {
  //         // this.promos = response;        
  //         // this.auditService.promotionAudit = this.promos;
  //         response.forEach(p => {
  //           this.listAudit.push(p)
  //         })
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
  // getMedia() {
  //   this.subscriptions.push(
  //     this.galerieService.findAllByMedia().subscribe(
  //       (response: Audit[]) => {         
  //         response.forEach(p => {
  //           this.listAudit.push(p)
  //         })
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
  // getResponse() {
  //   this.subscriptions.push(
  //     this.responseService.findAllResponse().subscribe(
  //       (response: Audit[]) => {
  //         // console.log(response);                   
  //         response.forEach(p => {
  //           this.listAudit.push(p);
  //         })
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //       }
  //     )
  //   );
  // }
 


  getGraphe() {
    this.userService.getUsers().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN") {
          this.adminstat.push(data[i]);
        }

        if (data[i].role == "ROLE_ALUM") {
          this.alumnistat.push(data[i]);
        }

        if (data[i].role == "ROLE_FORMATEUR") {
          this.formateurstat.push(data[i]);
        }
      }
      this.pieChartOptions = {
        responsive: true,
      };
      this.pieChartLabels = [['Alumnis'], ['Formateurs'], 'Administrateurs'];
      this.pieChartData = [this.alumnistat.length, this.formateurstat.length, this.adminstat.length];
      this.pieChartType = 'pie';
      this.pieChartLegend = true;
      this.pieChartPlugins = [];
    })


  }

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Administrateur', 'Super_Admin', 'Formateur', 'Promotion', 'Femmes', 'Hommes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Nombre promotion' }
  ]



  saveNewMedia() {
    this.clickButton('new-catForum-save')
  }



  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
    console.log(fileName, profileImage);
  }

  show(id: any) {
    this.userService.setImage(id);
    this.ref = this.dialoService.open(ViewimageComponent, {
      header: 'Détail activité',
      width: '50%',
      // contentStyle: {"max-height": "500px", "overflow": "auto"},
      // baseZIndex: 10000
    });



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


}
