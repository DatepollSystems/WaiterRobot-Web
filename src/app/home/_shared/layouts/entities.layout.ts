import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {FullScreenService} from '../services/fullscreen.service';

@Component({
  template: `
    <div class="d-flex flex-column flex-md-row justify-content-between gap-4">
      <div class="col-md-4 col-lg-3 col-xl-2" [class.col-xxl-1]="isFullScreen()">
        <ng-content select="[nav]" />
      </div>
      <div class="col-md-7 col-lg-8 col-xl-9" [class.col-xxl-10]="isFullScreen()">
        <router-outlet />
      </div>
    </div>
  `,
  selector: 'entities-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  standalone: true,
})
export class EntitiesLayout {
  isFullScreen = inject(FullScreenService).isFullScreen;
}
