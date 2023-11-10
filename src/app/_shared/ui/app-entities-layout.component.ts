import {NgIf} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NgSub} from 'dfx-helper';

import {FullScreenService} from '../services/fullscreen.service';

@Component({
  template: `
    <div class="row g-3" *ngSub="isFullScreen$; let isFullScreen">
      <div class="col-lg-4 col-xl-3" [class.col-xxl-2]="isFullScreen" *ngIf="showNav">
        <ng-content select="[nav]" />
      </div>
      <div [class.col-lg-8]="showNav" [class.col-xl-9]="showNav" [class.col-xxl-10]="isFullScreen && showNav" [class.col]="!showNav">
        <div class="px-3 px-md-4">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  selector: 'entities-layout-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterOutlet, NgSub],
  standalone: true,
})
export class AppEntitiesLayoutComponent {
  @Input({transform: booleanAttribute}) showNav = true;

  isFullScreen$ = inject(FullScreenService).isFullScreen$;
}
