import { NotificationService } from './../service/notification.service';
import { AuthenticationService } from './../service/authentication.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService:AuthenticationService, private router:Router, private notificationService: NotificationService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }
  private isUserLoggedIn(): boolean {
    if(this.authenticationService.isUserloggedIn()){
      return true;
    }
    this.router.navigate(['/login'])
    this.notificationService.notify(NotificationType.ERROR, `Vous devez vous connecter pour avoir accès à cette page `);
    return false;
  }
  
}
