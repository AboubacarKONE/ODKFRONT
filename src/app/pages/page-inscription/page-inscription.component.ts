import { Log } from './../../model/Log';
import { LogService } from './../../service/log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './../../model/User';
import { NotificationService } from './../../service/notification.service';
import { AuthenticationService } from './../../service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { audit } from 'src/app/enum/audit';

@Component({
  selector: 'app-page-inscription',
  templateUrl: './page-inscription.component.html',
  styleUrls: ['./page-inscription.component.scss']
})
export class PageInscriptionComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  public log = new Log;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private notificationService: NotificationService, private logService: LogService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserloggedIn()) {
      this.router.navigateByUrl('/login');
    }
  }

  public onRegisterUser(user: User): void {
    this.loading = true;
    this.subscriptions.push(
      this.authenticationService.registerUser(user).subscribe(
        (response: User) => {
          this.log.action = `creation de compte pour ${user.email}`;
          this.log.tableName = audit.AJOUTER
          this.log.createdBy = user;
          this.logService.saveLog(this.log);
          this.loading = false;
          this.sendNotification(NotificationType.SUCCESS, `Un nouveau compte a été créé pour ${response.prenom}.
              Please vérifiez votre E-mail pour le mot de passe pour vous connecter.`);

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
