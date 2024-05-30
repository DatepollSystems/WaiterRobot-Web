import {NumberInput} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

@Component({
  template: `
    <div class="card bg-body-tertiary">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2">
          <div
            class="rounded-5 bg-info-subtle d-inline-flex align-items-center justify-content-center"
            style="width: 60px; height: 60px; padding-top: 5px"
          >
            <ng-content select="[icon]" />
          </div>
          <div class="d-flex flex-column">
            <div class="blur fs-4" [class.unblur]="!isBlurred()">
              <strong>{{ count }}</strong>
              <ng-content select="[valuePrefix]" />
            </div>
            <span class="fs-6">
              <ng-content />
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  selector: 'app-statistics-count-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountCardComponent {
  @Input() count: NumberInput;

  isBlurred = injectBlurSetting().isBlurred;
}
