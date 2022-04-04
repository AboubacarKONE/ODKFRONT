import { User } from 'src/app/model/User';
import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from './menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public menuProperties: Array<Menu> = [
    {
    id: '1',
    titre: 'Tableau de bord',
    icon: 'fas fa-chart-line',
    url: '',
    sousMenu: [
      {
        id: '11',
        titre: 'Vue d\'ensemble',
        icon: 'fas fa-chart-pie',
        url: 'statistiques'
      }
    ]
  },
    {
      id: '2',
      titre: 'Utilisateurs',
      icon: 'fas fa-users',
      url: '',
      sousMenu: [
        {
          id: '21',
          titre: 'Utilisateurs',
          icon: 'fa-solid fa-user-gear',
          url: 'administrateurs'
        }
      ]
    },
    {
      id: '3',
      titre: 'Promotion',
      icon: 'fa-solid fa-graduation-cap',
      url: 'promotion',
      sousMenu: [
        {
          id: '31',
          titre: 'promotions',
          icon: 'fa-solid fa-graduation-cap',
          url: 'promotions'
        }
      ]
    },
    {
      id: '4',
      titre: 'Galerie',
      icon: 'fa-solid fa-image',
      url: 'galerie',
      sousMenu: [
        {
          id: '41',
          titre: 'galeries',
          icon: 'fa-solid fa-image',
          url: 'galerie'
        }
      ]
    },
    {
      id: '5',
      titre: 'Forum',
      icon: 'fa-solid fa-comments',
      url: 'forum',
      sousMenu: [
        {
          id: '51',
          titre: 'forum',
          icon: 'fa-solid fa-comments',
          url: 'forum'
        },
        // {
        //   id: '52',
        //   titre: 'Chat',
        //   icon: 'fa-solid fa-comment',
        //   url: 'chat'
        // },
      ]
    },
    {
      id: '6',
      titre: 'Parametrages',
      icon: 'fas fa-cogs',
      url: '',
      sousMenu: [
        {
          id: '61',
          titre: 'Reset mot de passe',
          icon: 'fa-solid fa-key',
          url: 'resetPassword'
        },
        {
          id: '62',
          titre: 'Changer mot de passe',
          icon: 'fa-solid fa-key',
          url: 'changerPassword'
        }
      ]
    }
  ];
private lastSelectedMenu: Menu | undefined;
public isAlumni:boolean;
public isAlumniOrFormateur:boolean; 
  constructor(private router:Router, private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.isAlumni = this.authenticationService.isAlumni;
    this.isAlumniOrFormateur = this.authenticationService.isAlumniOrFormateur;

  }
  navigate(menu: Menu): void {
    if (this.lastSelectedMenu) {
      this.lastSelectedMenu.active = false;
    }
    menu.active = true;
    this.lastSelectedMenu = menu;
    this.router.navigate([menu.url]);
  }

}
