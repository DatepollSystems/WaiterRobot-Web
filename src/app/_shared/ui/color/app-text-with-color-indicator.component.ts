import {NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {AppColorIndicatorComponent} from './app-color-indicator.component';

@Component({
  template: `
    <div class="d-flex align-items-center" [ngClass]="{'gap-3': !!color}">
      <app-color-indicator *ngIf="color" [color]="color" />
      <ng-content />
    </div>
  `,
  standalone: true,
  selector: 'app-text-with-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgIf, AppColorIndicatorComponent],
})
export class AppTextWithColorIndicatorComponent {
  @Input({required: true}) color?: string | null;
}
