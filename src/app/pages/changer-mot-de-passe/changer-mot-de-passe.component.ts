import { audit } from 'src/app/enum/audit';
import { Log } from './../../model/Log';
import { LogService } from './../../service/log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Subscription } from 'rxjs';
import { UserService } from './../../service/user.service';
import { ChangerModp } from './../../model/changerMdp';
import { User } from './../../model/User';
import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-changer-mot-de-passe',
  templateUrl: './changer-mot-de-passe.component.html',
  styleUrls: ['./changer-mot-de-passe.component.scss']
})
export class ChangerMotDePasseComponent implements OnInit {
  public user:User;  
  public mtdp:ChangerModp ={};
  public log = new Log;
  private subscriptions: Subscription[] = [];
  constructor(private authenticationService: AuthenticationService, private userService:UserService, private notificationService:NotificationService,
    private logService:LogService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache(); 
    
  }
  changerMotDePasseUtilisateur(){
    this.mtdp.id = this.user.id;  
    console.log(this.mtdp);          
   this.subscriptions.push(
    this.userService.updatePassword(this.mtdp).subscribe(
      (response:User)=>{
        this.log.action = `Changement de mot passe`;
        this.log.tableName = audit.MODIFIER
        this.log.createdBy = this.user;
        this.logService.saveLog(this.log).subscribe(
          (audit: Log) => {

          });
        console.log(response);
        this.sendNotification(NotificationType.SUCCESS, `Mot de passe changer avec succès`)
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);       
      }
    )
   )
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur s\'est produite. Please try again.');
    }
  }

}
