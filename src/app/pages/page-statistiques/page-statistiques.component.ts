import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
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

adminstat: any = [];
alumnistat: any = [];
formateurstat: any = [];

pieChartOptions: ChartOptions
pieChartLabels: Label[]
pieChartData: SingleDataSet
pieChartType: ChartType
pieChartLegend = true;
pieChartPlugins: any

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

    this.getGraphe();
  }

  getGraphe(){
    this.userService.getUsers().subscribe((data: any)=>{
      for(let i=0; i< data.length; i++){
        if(data[i].role == "ROLE_SUPER_ADMIN" || data[i].role == "ROLE_ADMIN"){
          this.adminstat.push(data[i]);
        }

        if(data[i].role == "ROLE_ALUM" ){
          this.alumnistat.push(data[i]);
        }

        if(data[i].role == "ROLE_FORMATEUR" ){
          this.formateurstat.push(data[i]);
        }
      }
      this.pieChartOptions = {
        responsive: true,
      };
      this.pieChartLabels = [['Alumnis'], ['Formateurs'], 'Administrateurs'];
      this.pieChartData = [ this.alumnistat.length, this.formateurstat.length,  this.adminstat.length];
      this.pieChartType= 'pie';
      this.pieChartLegend = true;
      this.pieChartPlugins = [];
    })
  
 
  }
  



  
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Administrateur', 'Super_Admin', 'Formateur', 'Promotion', 'Femmes', 'Hommes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ]

}
