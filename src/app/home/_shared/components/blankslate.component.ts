import {Component, input} from '@angular/core';
import {BiComponent, BiName} from 'dfx-bootstrap-icons';

@Component({
  template: `
    @if (show()) {
      <div class="d-flex flex-column gap-3 p-5 align-items-center text-center">
        @if (icon(); as icon) {
          <bi width="36px" height="36px" [name]="icon" />
        }
        @if (header(); as header) {
          <h2 class="my-0">{{ header }}</h2>
        }
        @if (description(); as description) {
          <span class="text-muted">{{ description }}</span>
        }
        <div class="mt-2"></div>
        <ng-content />
      </div>
    }
  `,
  selector: 'app-blankslate',
  standalone: true,
  imports: [BiComponent],
})
export class BlankslateComponent {
  show = input(true);
  icon = input<BiName>();
  header = input<string>();
  description = input<string>();
}
