import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../service/notification.service';
import { Subscription } from 'rxjs';
import { UserService } from './../../service/user.service';
import { NotificationType } from './../../enum/notification-type.enum';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-reset-mot-de-passe',
  templateUrl: './reset-mot-de-passe.component.html',
  styleUrls: ['./reset-mot-de-passe.component.scss']
})
export class ResetMotDePasseComponent implements OnInit , OnDestroy{
  private subscriptions: Subscription[] = [];
  public refreshing: boolean;
  public isAdmin : boolean;
  constructor(private authenticationService: AuthenticationService,private router:Router, private userService: UserService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin;
  }
  public onResetPassword(emailForm: NgForm): void{
    this.refreshing = true;
    const emailAdresse = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassord(emailAdresse).subscribe(
        (response:CustomHttpRespone)=>{
          this.sendNotification(NotificationType.SUCCESS,response.message);          
          this.refreshing = false
        },
        (errorResponse: HttpErrorResponse)=>{
          this.sendNotification(NotificationType.WARNING, errorResponse.error.message);
          this.refreshing = false
        },
        ()=>emailForm.reset()
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
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
