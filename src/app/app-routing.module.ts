import { PageInscriptionAlumniComponent } from './pages/page-inscription-alumni/page-inscription-alumni.component';
import { AlumnisComponent } from './composants/alumnis/alumnis.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { ChangerMotDePasseComponent } from './pages/changer-mot-de-passe/changer-mot-de-passe.component';
import { ForumComponent } from './pages/forum/forum.component';
import { GaleriephotoComponent } from './pages/galerie/galerie.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { FormateursComponent } from './pages/formateurs/formateurs.component';
import { AdministrateursComponent } from './pages/administrateurs/administrateurs.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetMotDePasseComponent } from './pages/reset-mot-de-passe/reset-mot-de-passe.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path:'login',
    component:PageLoginComponent
  },
  {
    path:'inscrire',
    component:PageInscriptionComponent
  },
  {
    path:'inscrire/alumni',
    component:PageInscriptionAlumniComponent
  },
  {
    path:'',
    component:PageDashboardComponent,
    canActivate:[AuthenticationGuard],
    children:[
      {
        path:'statistiques',
        component:PageStatistiquesComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'administrateurs',
        component:AdministrateursComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'formateurs',
        component:FormateursComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'forum',
        component:ForumComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'promotions',
        component:PromotionComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'galerie',
        component:GaleriephotoComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'changerPassword',
        component:ChangerMotDePasseComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'resetPassword',
        component:ResetMotDePasseComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'profile',
        component:ProfileComponent,
        canActivate:[AuthenticationGuard]
      },
      {
        path:'alumni/:id',
        component:AlumnisComponent,
        canActivate:[AuthenticationGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
