import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

@Component({
  selector: 'app-btn-toolbar',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule],
  templateUrl: './app-btn-toolbar.component.html',
  styles: [],
})
export class AppBtnToolbarComponent {}
