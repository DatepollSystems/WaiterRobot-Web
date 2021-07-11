import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toggleNav(collapsable: any): void {
    if (collapsable.style.display === 'none') {
      collapsable.style.display = 'block';
    } else {
      collapsable.style.display = 'none';
    }
  }

}
