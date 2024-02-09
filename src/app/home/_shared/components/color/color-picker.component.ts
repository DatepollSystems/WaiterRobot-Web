import {NgClass} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppIsLightColorPipe} from './app-is-light-color.pipe';

@Component({
  template: `
    <div class="btn-group" role="group">
      <button
        id="color-picker-button"
        class="btn btn-outline-secondary"
        (click)="showColorPicker.set(!showColorPicker())"
        [disabled]="disabled"
        type="button"
        [style.background-color]="color"
        [style.border-color]="color"
        [ngClass]="{
          'text-white': !(color | isLightColor) && color,
          'text-dark': (color | isLightColor) && color,
          'text-body-emphasis': !color
        }"
        [autoClose]="'outside'"
        placement="bottom"
        [ngbPopover]="popContent"
        container="body"
        popoverClass="color-picker-class"
      >
        {{ 'COLOR_PICKER' | tr }}
      </button>

      <div ngbTooltip="{{ 'RESET' | tr }}">
        <button
          class="btn btn-outline-secondary"
          (click)="color = undefined; colorChange.emit(undefined)"
          [disabled]="disabled"
          type="button"
        >
          <bi name="x-circle-fill" />
        </button>
      </div>
    </div>

    <ng-template #popContent>
      <div class="d-flex flex-row flex-wrap" style="width: 200px">
        @for (color of colors; track color) {
          <button class="color-btn" type="button" (click)="changeColor(color)" [style.background-color]="color"></button>
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
      .color-btn {
        border: none;
        width: 33px;
        height: 33px;
      }
    `,
  ],
  standalone: true,
  selector: 'app-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, BiComponent, NgbPopover, NgClass, AppIsLightColorPipe, NgbTooltip],
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
  colorChange: EventEmitter<string> = new EventEmitter<string>();

  changeColor(event: string): void {
    this.color = event;
    this.colorChange.emit(this.color);
  }
}
