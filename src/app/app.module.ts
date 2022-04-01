import { NotificationService } from './service/notification.service';
import { NotificationModule } from './notification.module';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { UserService } from './service/user.service';
import { AuthenticationService } from './service/authentication.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from "primeng/dialog";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CarouselModule} from 'primeng/carousel';
import {ImageModule} from 'primeng/image';
import { ChartsModule } from 'ng2-charts';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { MenuComponent } from './composants/menu/menu.component';
import { HeaderComponent } from './composants/header/header.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { AdministrateursComponent } from './pages/administrateurs/administrateurs.component';
import { FormateursComponent } from './pages/formateurs/formateurs.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
//import { GaleriephotoComponent } from './pages/galerie/galerie.component';
import { ForumComponent } from './pages/forum/forum.component';
import { ChangerMotDePasseComponent } from './pages/changer-mot-de-passe/changer-mot-de-passe.component';
import { PaginationComponent } from './composants/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';
import {PanelModule} from 'primeng/panel';
import { ResetMotDePasseComponent } from './pages/reset-mot-de-passe/reset-mot-de-passe.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AlumnisComponent } from './composants/alumnis/alumnis.component';
import { GaleriephotoComponent } from './pages/galerie/galerie.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ExcelPromoComponent } from './pages/excel-promo/excel-promo.component';
import { ViewimageComponent } from './viewimage/viewimage.component';
import { PageInscriptionAlumniComponent } from './pages/page-inscription-alumni/page-inscription-alumni.component';


//import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    PageLoginComponent,
    PageInscriptionComponent,
    PageDashboardComponent,
    MenuComponent,
    HeaderComponent,
    PageStatistiquesComponent,
    AdministrateursComponent,
    FormateursComponent,
    PromotionComponent,
    GaleriephotoComponent,
    ForumComponent,
    ChangerMotDePasseComponent,
    PaginationComponent,
    ResetMotDePasseComponent,
    ProfileComponent,
    AlumnisComponent,
    ExcelPromoComponent,
    ViewimageComponent,
    PageInscriptionAlumniComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    Ng2SearchPipeModule,
    TabViewModule,
    AccordionModule,
    DialogModule,
    PanelModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    CarouselModule,
    ImageModule,
    ChartsModule
    //ChartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [DialogService, NotificationService, AuthenticationGuard, AuthenticationService, UserService, 
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
