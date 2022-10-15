import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'entities-layout-component',
  template: `
    <div class="d-flex flex-column flex-lg-row gap-3">
      <div class="col-lg-4 col-xl-3" *ngIf="_showNav">
        <ng-content select="[nav]"></ng-content>
      </div>
      <div [class.col-lg-8]="_showNav" [class.col-xl-9]="_showNav" [class.col]="!_showNav">
        <div class="card bg-dark">
          <div class="card-body px-4">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppEntitiesLayoutComponent {
  @Input() set showNav(it: BooleanInput) {
    this._showNav = coerceBooleanProperty(it);
  }
  _showNav = true;
}
