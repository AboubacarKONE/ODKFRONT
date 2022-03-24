import { HeaderType } from './../../enum/header-type.enum';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from './../../model/User';
import { NotificationService } from './../../service/notification.service';
import { AuthenticationService } from './../../service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  private subscriptions:Subscription[]=[];  
  private token:any;  
  constructor(private router: Router, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if(this.authenticationService.isUserloggedIn()){
      this.router.navigate(['statistiques']);
    }else{
      this.router.navigateByUrl('/login');
    }
  }
  public onLogin(user:User):void {
    this.loading = true;
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          this.token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(this.token);
          localStorage.setItem('user', JSON.stringify(response.body));
          this.router.navigateByUrl('statistiques');
          this.loading = false;
        },
        (errorResponse: HttpErrorResponse) =>{
          console.log(errorResponse);
          this.sendErrorNotification(NotificationType.ERROR,errorResponse.error.message)
          this.loading = false;
        }
        
      )
    )
    
  }
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
  if(message){
    this.notificationService.notify(notificationType, message);
  }else{
    this.notificationService.notify(notificationType,'une erreur est survenue, please veuillez réessayer');
  }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=> sub.unsubscribe());
  }

}
