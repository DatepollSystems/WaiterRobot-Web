import {NgClass} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal} from '@angular/core';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ColorGithubModule} from 'ngx-color/github';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppIsLightColorPipe} from './app-is-light-color.pipe';

@Component({
  template: `
    <div class="btn-group">
      <button
        id="color-picker-button"
        class="btn btn-outline-info"
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

      <button
        class="btn btn-outline-secondary"
        (click)="color = undefined; colorChange.emit(undefined)"
        [disabled]="disabled"
        type="button"
        ngbTooltip="{{ 'RESET' | tr }}"
      >
        <bi name="x-circle-fill" />
      </button>
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
  imports: [DfxTr, ColorGithubModule, BiComponent, NgbPopover, NgClass, AppIsLightColorPipe, NgbTooltip],
})
export class AppColorPicker {
  @Input() color?: string | null;

  @Input({transform: booleanAttribute}) disabled?: boolean;

  showColorPicker = signal(false);

  colors = [
    '#ff5151',
    '#ffce5c',
    '#27dd70',
    '#16e7d9',
    '#CD47FF',
    '#726DFF',
    '#726DFF',
    '#B6F423',
    '#BE935B',
    '#ff5151',
    '#ffce5c',
    '#27dd70',
  ];

  @Output()
  colorChange: EventEmitter<string> = new EventEmitter<string>();

  changeColor(event: string): void {
    this.color = event;
    this.colorChange.emit(this.color);
  }
}
