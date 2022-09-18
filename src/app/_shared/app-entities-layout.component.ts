import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, RouterModule],
  selector: 'app-entities-layout-component',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between" fxLayout.lt-md="column" fxLayoutGap.lt-md="4%">
      <div fxFlex="30%" fxFlex.gt-md="25%" fxFlex.gt-lg="20%">
        <ng-content select="[nav]"></ng-content>
      </div>
      <div fxFlex="69%" fxFlex.gt-md="74%" fxFlex.gt-lg="79%">
        <div class="card bg-dark">
          <div class="card-body px-4">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppEntitiesLayoutComponent {}
