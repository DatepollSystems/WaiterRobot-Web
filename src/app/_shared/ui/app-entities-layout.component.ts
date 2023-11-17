import {booleanAttribute, ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {FullScreenService} from '../services/fullscreen.service';

@Component({
  template: `
    <div class="d-flex flex-column flex-md-row justify-content-between gap-4">
      @if (showNav) {
        <div class="col-md-4 col-lg-3 col-xl-2" [class.col-xxl-1]="isFullScreen()">
          <ng-content select="[nav]" />
        </div>
      }
      <div
        [class.col-md-7]="showNav"
        [class.col-lg-8]="showNav"
        [class.col-xl-9]="showNav"
        [class.col-xxl-10]="isFullScreen() && showNav"
        [class.col]="!showNav"
      >
        <router-outlet />
      </div>
    </div>
  `,
  selector: 'entities-layout-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  standalone: true,
})
export class AppEntitiesLayoutComponent {
  @Input({transform: booleanAttribute}) showNav = true;

  isFullScreen = inject(FullScreenService).isFullScreen;
}
