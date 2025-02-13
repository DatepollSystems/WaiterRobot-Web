import {ChangeDetectionStrategy, Component, Input, booleanAttribute, inject, output, signal} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppTextColorByBackgroundDirective} from '@home-shared/components/color/app-text-color-by-background.directive';

import {ThemeService} from '@shared/services/theme.service';
import {systemColors} from '@shared/system-colors';

@Component({
  template: `
    @if (theme(); as theme) {
      <div class="btn-group" role="group">
        <button
          class="btn btn-outline-secondary"
          id="color-picker-button"
          [disabled]="disabled"
          [style.background-color]="color | adjustDarkModeColor: theme.id"
          [style.border-color]="color | adjustDarkModeColor: theme.id"
          [color]="color"
          [autoClose]="'outside'"
          [ngbPopover]="popContent"
          (mousedown)="showColorPicker.set(!showColorPicker())"
          type="button"
          placement="bottom"
          container="body"
          popoverClass="color-picker-class"
          app-text-color-by-background
        >
          {{ 'COLOR_PICKER' | transloco }}
        </button>

        <button
          class="btn btn-outline-secondary"
          [disabled]="disabled"
          (mousedown)="color = undefined; colorChange.emit(undefined)"
          type="button"
        >
          <bi [ngbTooltip]="'RESET' | transloco" name="x-circle-fill" />
        </button>
      </div>

      <ng-template #popContent>
        <div class="d-flex flex-row flex-wrap" style="width: 200px">
          @for (color of colors; track color) {
            <button
              class="color-btn"
              [style.background-color]="color | adjustDarkModeColor: theme.id"
              (mousedown)="changeColor(color)"
              type="button"
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
  selector: 'app-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, BiComponent, NgbPopover, NgbTooltip, AppAdjustDarkModeColor, AppTextColorByBackgroundDirective],
})
export class AppColorPicker {
  @Input() color?: string | null;

  @Input({transform: booleanAttribute}) disabled?: boolean;

  theme = inject(ThemeService).currentTheme;

  showColorPicker = signal(false);

  readonly colorChange = output<string | undefined>();

  changeColor(event: string): void {
    this.color = event;
    this.colorChange.emit(this.color);
  }

  protected readonly colors = systemColors;
}
