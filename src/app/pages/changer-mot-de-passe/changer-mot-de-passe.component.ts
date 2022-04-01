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
  public mtdp:ChangerModp
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache(); 
    
  }
  changerMotDePasseUtilisateur(){}
  cancel(){}

}
