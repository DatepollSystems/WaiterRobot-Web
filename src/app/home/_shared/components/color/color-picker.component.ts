import {NgClass} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppIsLightColorPipe} from './app-is-light-color.pipe';

@Component({
  template: `
    <div class="btn-group" role="group">
      <button
        id="color-picker-button"
        class="btn btn-outline-secondary"
        type="button"
        placement="bottom"
        container="body"
        popoverClass="color-picker-class"
        [disabled]="disabled"
        [style.background-color]="color"
        [style.border-color]="color"
        [ngClass]="{
          'text-white': !(color | isLightColor) && color,
          'text-dark': (color | isLightColor) && color,
          'text-body-emphasis': !color
        }"
        [autoClose]="'outside'"
        [ngbPopover]="popContent"
        (click)="showColorPicker.set(!showColorPicker())"
      >
        {{ 'COLOR_PICKER' | transloco }}
      </button>

      <button
        class="btn btn-outline-secondary"
        type="button"
        [disabled]="disabled"
        (click)="color = undefined; colorChange.emit(undefined)"
      >
        <bi name="x-circle-fill" [ngbTooltip]="'RESET' | transloco" />
      </button>
    </div>

    <ng-template #popContent>
      <div class="d-flex flex-row flex-wrap" style="width: 200px">
        @for (color of colors; track color) {
          <button class="color-btn" type="button" [style.background-color]="color" (click)="changeColor(color)">
            <span class="visually-hidden">Pick {{ color }}</span>
          </button>
        }
      </div>
    </ng-template>
  `,
  styles: `
    .color-btn {
      border: none;
      width: 33px;
      height: 33px;
    }
  `,
  standalone: true,
  selector: 'app-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, BiComponent, NgbPopover, NgClass, AppIsLightColorPipe, NgbTooltip],
})
export class AppColorPicker {
  @Input() color?: string | null;

  @Input({transform: booleanAttribute}) disabled?: boolean;

  showColorPicker = signal(false);

  colors = [
    '#EBEFFF',
    '#1B2347',
    '#C9D1FB',
    '#6750A4',
    '#D4DBFA',
    '#607DFF',
    '#F8FFA8',
    '#EFFF32',
    '#E0FFC0',
    '#ACFF56',
    '#FFDBF7',
    '#FF60DC',
  ];

  @Output()
  readonly colorChange: EventEmitter<string> = new EventEmitter<string>();

  changeColor(event: string): void {
    this.color = event;
    this.colorChange.emit(this.color);
  }
}
