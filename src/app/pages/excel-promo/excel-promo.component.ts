import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ManyAlumnis } from 'src/app/model/ManyAlumnis';
import { PromotionService } from 'src/app/service/promotion.service';
import { UserService } from 'src/app/service/user.service';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-excel-promo',
  templateUrl: './excel-promo.component.html',
  styleUrls: ['./excel-promo.component.scss']
})
export class ExcelPromoComponent implements OnInit {

  alumnis: any[] = [];
  userPromo: any;
  id: any;

  spinnerEnabled = false;
  keys!: string[];
  dataSheet = new Subject();
  data: any;
  @ViewChild('inputFile') inputFile!: ElementRef;
  isExcelFile!: boolean;
  name = 'Angular';
  fileName: string = 'SheetJS.xlsx';
  datas: any;
  headData: any // excel row header
  activite: any;
  manyPart: ManyAlumnis = new ManyAlumnis();


  constructor(private promoService: PromotionService,
    private userservice: UserService,
    private notificationService: NotificationService,
    private router: Router,) { }

  ngOnInit(): void {

  }


  onFileChange(evt: any) {
    // let data: any, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }

    if (this.isExcelFile) {
      this.alumnis = [];
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        // lire le classeur
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        // saisir la première feuille
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // enregistrer des données

        this.datas = XLSX.utils.sheet_to_json(ws);
        console.log(this.datas);
        const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];
        this.readDataSheet(ws2, 10);
      };

      reader.readAsBinaryString(target.files[0]);
      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(this.datas[0]);
      }

      this.PreviewFichier(evt);
    } else {
      this.inputFile.nativeElement.value = '';
    };
  }

  PreviewFichier(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(
        XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: 0 })
      );
      console.log(this.data[1]);

      this.headData = this.data[0];
      this.data = this.data.slice(1); // remove first header record

      const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];
      this.readDataSheet(ws2, 10);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  private readDataSheet(ws: XLSX.WorkSheet, startRow: number) {
    /* save data */
    let datas = <AOA>(
      XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: startRow })
    );
    console.log(datas[1]);
    let headDatas = datas[0];
    datas = datas.slice(1); // remove first header record

    for (let i = 0; i < this.data.length; i++) {
      this.data[i][this.headData.length] = datas.filter(
        (x) => x[12] == this.data[i][0]
      );
    }
    console.log(this.data[1]);
  }

  // export(): void {
  // 	/* generate worksheet */
  // 	const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

  // 	/* generate workbook and add the worksheet */
  // 	const wb: XLSX.WorkBook = XLSX.utils.book_new();
  // 	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 	/* save to file */
  // 	XLSX.writeFile(wb, this.fileName);
  // }

  annuler() {
    window.location.reload();
    // 
  }

  ajoutFichier() {
    this.id = this.userservice.getIdAlumnis();
    for (let i = 0; i < this.datas.length; i++) {
      // console.log(this.data[i]);
      this.alumnis.push({
        nom: this.datas[i].nom,
        prenom: this.datas[i].prenom,
        email: this.datas[i].email,
        telephone: this.datas[i].telephone,
        adresse: this.datas[i].adresse,
      });
    }
    this.manyPart.alumni = this.alumnis;
    //console.log("plusieurs part", this.manyPart);

    this.userservice.ajoutAlumiExcel(this.alumnis).subscribe((data: any) => {
      // window.location.reload();
      for (let i = 0; i < data.length; i++) {
        this.promoService.getPromotionById(this.id).subscribe((pro: any) => {
          this.userPromo = { 'user': data[i], 'promotion': pro }
          this.userservice.addUserPromo(this.userPromo).subscribe((data: any) => {
            // window.location.reload();

          })
        })

      }
      this.sendNotification(NotificationType.SUCCESS, `liste importée avec succès`)
      //  this.annuler()
      // this.router.navigateByUrl('promotions', {skipLocationChange: true}).then(()=>
      // this.router.navigate(['promotions'])); 

      // console.log("insert....", data)
    },
      (err => {
        console.log("erreur...", err);

      })
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
