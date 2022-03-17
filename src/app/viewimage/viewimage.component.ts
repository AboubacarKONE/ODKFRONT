import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-viewimage',
  templateUrl: './viewimage.component.html',
  styleUrls: ['./viewimage.component.scss']
})
export class ViewimageComponent implements OnInit {
image: any
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.image = this.userService.getImage();
  }

}
