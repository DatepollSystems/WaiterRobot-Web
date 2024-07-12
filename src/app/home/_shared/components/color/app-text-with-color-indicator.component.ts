import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {AppColorIndicatorComponent} from './app-color-indicator.component';

@Component({
  template: `
    <div class="d-flex align-items-center gap-2">
      @if (color() && placement() === 'left') {
        <app-color-indicator [color]="color()!" [size]="size()" />
      }

      <ng-content />

      @if (color() && placement() === 'right') {
        <app-color-indicator [color]="color()!" [size]="size()" />
      }
    </div>
  `,
  standalone: true,
  selector: 'app-text-with-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppColorIndicatorComponent],
})
export class AppTextWithColorIndicatorComponent {
  color = input<string | null>();
  placement = input<'left' | 'right'>('left');

  size = input(20);
}
