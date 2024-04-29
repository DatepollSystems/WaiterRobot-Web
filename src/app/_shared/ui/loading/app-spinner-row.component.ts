import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  template: `
    @if (show) {
      <div class="b-spinner-row">
        <div class="loader" aria-label=""></div>
      </div>
    }
  `,
  styles: `
    .b-spinner-row {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 30px;
    }
  `,
  selector: 'app-spinner-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSpinnerRowComponent {
  @Input({transform: booleanAttribute})
  show = true;
}
