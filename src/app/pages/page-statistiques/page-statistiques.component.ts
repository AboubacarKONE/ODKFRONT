import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-page-statistiques',
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {

nbreAdmin: any;
nbreAlumni: any;
nbreFormateur: any;
nbrePromo: any;

admin: any = [];
alumni: any = [];
formateur: any = [];
promo: any = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: any)=>{
      for(let i=0; i< data.length; i++){

        if(data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN"){
          this.admin.push(data[i]);
        }

        if(data[i].role == "ROLE_ALUM" ){
          this.alumni.push(data[i]);
        }

        if(data[i].role == "ROLE_FORMATEUR" ){
          this.formateur.push(data[i]);
        }

      }
      this.nbreAdmin = this.admin.length;
      this.nbreAlumni = this.alumni.length;
      this.nbreFormateur = this.formateur.length;
    })
  }

}
