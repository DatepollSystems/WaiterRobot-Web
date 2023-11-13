import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {AppColorIndicatorComponent} from './app-color-indicator.component';

@Component({
  template: `
    <div class="d-flex align-items-center" [class]="color ? 'gap-3' : ''">
      @if (placement === 'left') { @if (color) {
      <app-color-indicator [color]="color" [size]="size" />
      } }
      <ng-content />

      @if (placement === 'right') { @if (color) {
      <app-color-indicator [color]="color" [size]="size" />
      } }
    </div>
  `,
  standalone: true,
  selector: 'app-text-with-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppColorIndicatorComponent],
})
export class AppTextWithColorIndicatorComponent {
  @Input({required: true}) color?: string | null;
  @Input() placement: 'left' | 'right' = 'left';

  @Input() size = 20;
}
