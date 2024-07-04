import {NgClass} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {TranslocoPipe} from '@jsverse/transloco';

import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppIsLightColorPipe} from './app-is-light-color.pipe';
import {systemColors} from '@shared/system-colors';
import {ThemeService} from '@shared/services/theme.service';

@Component({
  template: `
    @if (theme(); as theme) {
      <div class="btn-group" role="group">
        <button
          id="color-picker-button"
          class="btn btn-outline-secondary"
          type="button"
          placement="bottom"
          container="body"
          popoverClass="color-picker-class"
          [disabled]="disabled"
          [style.background-color]="color | adjustDarkModeColor: theme.id"
          [style.border-color]="color | adjustDarkModeColor: theme.id"
          [ngClass]="{
            'text-white': !(color | adjustDarkModeColor: theme.id | isLightColor) && color,
            'text-dark': (color | adjustDarkModeColor: theme.id | isLightColor) && color,
            'text-body-emphasis': !color,
          }"
          [autoClose]="'outside'"
          [ngbPopover]="popContent"
          (mousedown)="showColorPicker.set(!showColorPicker())"
        >
          {{ 'COLOR_PICKER' | transloco }}
        </button>

        <button
          class="btn btn-outline-secondary"
          type="button"
          [disabled]="disabled"
          (mousedown)="color = undefined; colorChange.emit(undefined)"
        >
          <bi name="x-circle-fill" [ngbTooltip]="'RESET' | transloco" />
        </button>
      </div>

      <ng-template #popContent>
        <div class="d-flex flex-row flex-wrap" style="width: 200px">
          @for (color of colors; track color) {
            <button
              class="color-btn"
              type="button"
              [style.background-color]="color | adjustDarkModeColor: theme.id"
              (mousedown)="changeColor(color)"
            >
              <span class="visually-hidden">Pick {{ color }}</span>
            </button>
          }
        </div>
      </ng-template>
    }
  `,
  styles: `
    .color-btn {
      border: none;
      width: 33px;
      height: 33px;
    }

    ::ng-deep.color-picker-class > .popover-body {
      padding: 10px !important;
    }
  `,
  standalone: true,
  selector: 'app-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, BiComponent, NgbPopover, NgClass, AppIsLightColorPipe, NgbTooltip, AppAdjustDarkModeColor],
})
export class AppColorPicker {
  @Input() color?: string | null;

  @Input({transform: booleanAttribute}) disabled?: boolean;

  theme = inject(ThemeService).currentTheme;

  showColorPicker = signal(false);

  @Output()
  readonly colorChange: EventEmitter<string> = new EventEmitter<string>();

  changeColor(event: string): void {
    this.color = event;
    this.colorChange.emit(this.color);
  }

  protected readonly colors = systemColors;
}
