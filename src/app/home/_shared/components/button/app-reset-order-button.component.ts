import {LowerCasePipe} from '@angular/common';
import {Component, input, output} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    @if (isOrdering()) {
      <button type="button" class="btn btn-outline-danger btn-sm" [disabled]="disabled()" (click)="resetOrder.emit()">
        <bi name="x-circle" />
        {{ 'ORDER' | transloco }} {{ 'RESET' | transloco | lowercase }}
      </button>
    }
  `,
  selector: 'app-reset-order-button',
  imports: [BiComponent, LowerCasePipe, TranslocoPipe],
  standalone: true,
})
export class AppResetOrderButtonComponent {
  isOrdering = input.required<boolean>();
  disabled = input(false);
  resetOrder = output();
}
