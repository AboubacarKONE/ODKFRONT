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
  public isAdmin: boolean;
  public isFormateur: boolean;
  public isAlumni: boolean;
  public isAdminOrFormateur:boolean;
  public user: User;
  pageAlumnigalerie:number = 1;
  public mediaAdminOrFormateur:media[];
  public mediaAlum:media[];
  public mediaByUser:media[];
  public fileName: string;
  public profileImage: File;
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
              public dialoService: DialogService,
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
    this.isAdminOrFormateur =this.authenticationService.isAdminOrFormateur;
    this.userService.getUsers().subscribe((data: any)=>{
      for(let i=0; i< data.length; i++){

        if(data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN"){
          this.admin.push(data[i]);
        }

        if(data[i].role == "ROLE_ALUM" ){
          this.alumni.push(data[i]);
        }

        if(data[i].role == "ROLE_FORMATEUR" ){
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
    this.findAllByAlum();
  }
  findAllByAlum() {
    this.subscriptions.push(
      this.galerieService.findAllByAlum().subscribe(
        (response: media[]) => {
          this.mediaAlum = response;
          // console.log(this.mediaAlum);          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
  findAllMediaByUserId() {
    this.subscriptions.push(
      this.galerieService.findAllMediaByUserId(this.user.id).subscribe(
        (response: media[]) => {
          this.mediaByUser = response;
           console.log("content media",this.mediaByUser);          
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

  onScroll(){
    console.log('scrolled');
    
  }


  onNewMediaForum(mediaForm: NgForm) {
    if(this.profileImage == null){
      this.sendNotification(NotificationType.ERROR, `VEUILLEZ SELECTIONNER UN MEDIA`)
    }
    const formData = new FormData();
    formData.append('titre', mediaForm.value.titre);
    formData.append('idUser', JSON.stringify(this.user.id));
    formData.append('mediaImage', this.profileImage);
    // console.log(formData);
    this.subscriptions.push(
      this.galerieService.addNewMedia(formData).subscribe(
        (response: media) => {
          this.clickButton('new-media-close');
          this.fileName = null;
          this.profileImage = null;
          mediaForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `MEDIA AJOUTEE AVEC SUUCCES`)
          // this.getAllQuizByCatForum(this.idCat);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    )
  }
  // clickButton(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }
  sendNotification(ERROR: NotificationType, arg1: string) {
    throw new Error('Method not implemented.');
  }

  getGraphe(){
    this.userService.getUsers().subscribe((data: any)=>{
      for(let i=0; i< data.length; i++){
        if(data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN"){
          this.adminstat.push(data[i]);
        }

        if(data[i].role == "ROLE_ALUM" ){
          this.alumnistat.push(data[i]);
        }

        if(data[i].role == "ROLE_FORMATEUR" ){
          this.formateurstat.push(data[i]);
        }
      }
      this.pieChartOptions = {
        responsive: true,
      };
      this.pieChartLabels = [['Alumnis'], ['Formateurs'], 'Administrateurs'];
      this.pieChartData = [ this.alumnistat.length, this.formateurstat.length,  this.adminstat.length];
      this.pieChartType= 'pie';
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

  show(id: any){
    this.userService.setImage(id);
    this.ref = this.dialoService.open(ViewimageComponent, {
      header: 'Détail activité',
      width: '50%',
      // contentStyle: {"max-height": "500px", "overflow": "auto"},
      // baseZIndex: 10000
    });
    
    

  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click()
  }


}
