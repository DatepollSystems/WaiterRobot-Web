import {NumberInput} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

@Component({
  template: `
    <div class="card">
      <div class="card-body d-flex flex-column justify-content-between align-items-center gap-2">
        <h4 class="mt-1">
          <ng-content />
        </h4>
        <div class="heading text-center" [class.unblur]="isBlurred()">
          @if (count === 0) {
            <span>0</span>
          } @else {
            <span animationDuration="2000" clickable="false" [countUp]="count"></span>
          }
          <ng-content select="[valuePrefix]" />
        </div>
      </div>
    </div>
  `,
  styles: `
    .heading {
      font-size: 2.8rem;
    }
  `,
  selector: 'app-statistics-count-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountCardComponent {
  @Input() count: NumberInput;

  isBlurred = injectBlurSetting().isBlurred;
}
