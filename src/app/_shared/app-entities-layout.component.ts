import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'entities-layout-component',
  template: `
    <div class="d-flex flex-column flex-lg-row gap-3">
      <div class="col-lg-4 col-xl-3">
        <ng-content select="[nav]"></ng-content>
      </div>
      <div class="col-lg-8 col-xl-9">
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
