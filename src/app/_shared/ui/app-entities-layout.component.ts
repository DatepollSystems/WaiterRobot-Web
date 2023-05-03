import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  template: `
    <div class="row g-3">
      <div class="col-lg-4 col-xl-3" *ngIf="_showNav">
        <ng-content select="[nav]" />
      </div>
      <div [class.col-lg-8]="_showNav" [class.col-xl-9]="_showNav" [class.col]="!_showNav">
        <div class="card bg">
          <div class="card-body px-3 px-md-4">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ['.bg {background-color: var(--primary-8)}'],
  selector: 'entities-layout-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterOutlet],
  standalone: true,
})
export class AppEntitiesLayoutComponent {
  @Input() set showNav(it: BooleanInput) {
    this._showNav = coerceBooleanProperty(it);
  }
  _showNav = true;
}
