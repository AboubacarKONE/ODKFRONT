import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from './../../enum/notification-type.enum';
import { NotificationService } from './../../service/notification.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../service/authentication.service';
import { User } from './../../model/User';
import { media } from './../../model/Media';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GalerieService } from 'src/app/service/galerie.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-galerie',
  templateUrl: './galerie.component.html',
  styleUrls: ['./galerie.component.scss']
})
export class GaleriephotoComponent implements OnInit {
  public user: User;
  pageAlumnigalerie:number = 1;
  public mediaAdminOrFormateur:media[];
  public mediaAlum:media[];
  public mediaByUser:media[];
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  constructor(public galerieService: GalerieService, private authenticationService: AuthenticationService, private notificationService: NotificationService) 
  {
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
    this.user = this.authenticationService.getUserFromLocalCache();
    this.findAllByAdminAndFormateur();    
    this.findAllMediaByUserId();
    this.findAllByAlum();
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
  public findAllByAdminAndFormateur() {
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
  public findAllByAlum() {
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
  public findAllMediaByUserId() {
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
  saveNewMedia() {
    this.clickButton('new-catForum-save')
  }
  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
    console.log(fileName, profileImage);
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
