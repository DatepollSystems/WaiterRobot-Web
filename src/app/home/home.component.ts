import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  toggleNav(collapsable: any): void {
    if (collapsable.style.display === 'none') {
      collapsable.style.display = 'block';
    } else {
      collapsable.style.display = 'none';
    }
  }

  logout(): void {
    this.authService.logout();
  }

}
