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
  private subscriptions: Subscription[] = [];
  constructor(private authenticationService: AuthenticationService, private userService:UserService, private notificationService:NotificationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache(); 
    
  }
  changerMotDePasseUtilisateur(){
    this.mtdp.id = this.user.id;
   this.subscriptions.push(
    this.userService.updatePassword(this.mtdp).subscribe(
      (response:ChangerModp)=>{
        this.sendNotification(NotificationType.SUCCESS, `Mot de passe changer avec succès`)
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
  cancel(){}

}
