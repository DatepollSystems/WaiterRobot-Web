import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {systemColors} from '@shared/system-colors';
import {NgClass, UpperCasePipe} from '@angular/common';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppIsLightColorPipe} from '@home-shared/components/color/app-is-light-color.pipe';
import {ThemeService} from '@shared/services/theme.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-system-colors">System Colors</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (mousedown)="activeModal.close(undefined)"></button>
    </div>
    <div class="modal-body">
      <table style="border-width: 0">
        <thead>
          <tr>
            <td class="bg-white text-dark p-2">Original</td>
            <td class="bg-dark text-white p-2">Dark mode</td>
          </tr>
        </thead>
        <tbody>
          @for (color of colors; track $index) {
            <tr>
              <td class="bg-white p-2">
                <div
                  class="p-1"
                  [style.background-color]="color"
                  [ngClass]="{
                    'text-white': !(color | isLightColor) && color,
                    'text-dark': (color | isLightColor) && color,
                  }"
                >
                  {{ color }}
                </div>
              </td>
              <td class="bg-dark p-2">
                <div
                  class="p-1"
                  [style.background-color]="color | adjustDarkModeColor: 'dark'"
                  [ngClass]="{
                    'text-white': !(color | adjustDarkModeColor: 'dark' | isLightColor),
                    'text-dark': (color | adjustDarkModeColor: 'dark' | isLightColor),
                  }"
                >
                  {{ color | adjustDarkModeColor: 'dark' | uppercase }}
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  selector: 'app-system-colors',
  standalone: true,
  imports: [NgClass, AppAdjustDarkModeColor, AppIsLightColorPipe, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSystemColorsModal {
  activeModal = inject(NgbActiveModal);
  theme = inject(ThemeService).currentTheme;

  readonly colors = systemColors;
}
