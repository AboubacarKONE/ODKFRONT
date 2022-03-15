import { AuthenticationService } from './../../service/authentication.service';
import { User } from './../../model/User';
import { UserService } from './../../service/user.service';
import { Component, OnInit, Injectable, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit {
  // @Input()
  // public search;
  public user : User;
  @Output()
  clickEvent = new EventEmitter();
  constructor(private authenticationService: AuthenticationService) { }
  
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }
 
  
  
  // bouttonNouveauClick(): void {
  //   this.clickEvent.emit();
  // }
  // bouttonNouveauClick(): void {
  //   this.clickEvent.emit();
  // }

}
