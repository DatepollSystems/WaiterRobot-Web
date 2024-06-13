import {ChangeDetectionStrategy, Component} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

@Component({
  template: `
    <div class="card bg-body-tertiary">
      <div class="card-body">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-5 bg-info-subtle d-inline-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <ng-content select="[icon]" />
          </div>
          <div class="d-flex flex-column">
            <div class="blur fs-4 fw-bold" [class.unblur]="!isBlurred()">
              <ng-content select="[value]" />
            </div>
            <span class="fs-6">
              <ng-content select="[description]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  selector: 'app-statistics-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCardComponent {
  isBlurred = injectBlurSetting().isBlurred;
}
