import {NumberInput} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    <div class="card">
      <div class="card-body text-center d-flex flex-column gap-2">
        <h4>
          <ng-content />
        </h4>
        <p class="heading">
          <span class="clickable" [countUp]="count"></span>
          <ng-content select="[valuePrefix]" />
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .heading {
        font-size: 3rem;
      }
    `,
  ],
  selector: 'app-statistics-count-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountCardComponent {
  @Input() count: NumberInput;
}
