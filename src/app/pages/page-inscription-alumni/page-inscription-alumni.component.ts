import { Log } from './../../model/Log';
import { LogService } from './../../service/log.service';
import { NotificationService } from './../../service/notification.service';
import { AuthenticationService } from './../../service/authentication.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType } from './../../enum/notification-type.enum';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { audit } from 'src/app/enum/audit';

@Component({
  selector: 'app-page-inscription-alumni',
  templateUrl: './page-inscription-alumni.component.html',
  styleUrls: ['./page-inscription-alumni.component.scss']
})
export class PageInscriptionAlumniComponent implements OnInit {
  public log = new Log;
  public loading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService, private logService:LogService) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserloggedIn()) {
      this.router.navigateByUrl('/login');
    }
  }

  public onRegisterAlumni(user: User): void {
    this.loading = true;
    this.subscriptions.push(
      this.authenticationService.registerAlumni(user).subscribe(
        (response: User) => {
          this.log.action= `creation de compte pour ${response.login}`;
          this.log.tableName = audit.AJOUTER
          this.log.createdBy = response;                 
          this.logService.saveLog(this.log).subscribe(
            (audit: Log) => {
              this.loading = false;
              this.sendNotification(NotificationType.SUCCESS, `Un nouveau compte a été créé pour ${response.prenom}.
              Please vérifiez votre E-mail pour le mot de passe pour vous connecter.`);
            });       
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.loading = false;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
