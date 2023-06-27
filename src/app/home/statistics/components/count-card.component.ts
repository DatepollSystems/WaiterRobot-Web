import {NumberInput} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    <div class="card">
      <div class="card-body d-flex flex-column justify-content-between align-items-center gap-2">
        <h4 class="mt-1">
          <ng-content />
        </h4>
        <div class="heading text-center">
          <!-- TODO: fix in library-->
          <ng-container *ngIf="count === 0; else notZero">
            <span>0</span>
          </ng-container>
          <ng-template #notZero>
            <span [countUp]="count" animationDuration="2000" clickable="false"></span>
          </ng-template>
          <ng-content select="[valuePrefix]" />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .heading {
        font-size: 2.8rem;
      }
    `,
  ],
  selector: 'app-statistics-count-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountCardComponent {
  @Input() count: NumberInput;
}
