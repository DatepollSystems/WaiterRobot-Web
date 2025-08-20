import {UpperCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {ThemeService} from '../../services/theme.service';
import {systemColors} from '../../util/system-colors';
import {AppAdjustDarkModeColor} from '../color/app-adjust-dark-mode-color.pipe';
import {AppIsLightColorPipe} from '../color/app-is-light-color.pipe';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-system-colors">System Colors</h4>
      <button class="btn-close btn-close-white" (mousedown)="activeModal.close(undefined)" type="button" aria-label="Close"></button>
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
                  [class.text-white]="!(color | isLightColor) && color"
                  [class.text-dark]="(color | isLightColor) && color"
                >
                  {{ color }}
                </div>
              </td>
              <td class="bg-dark p-2">
                <div
                  class="p-1"
                  [style.background-color]="color | adjustDarkModeColor: 'dark'"
                  [class.text-white]="!(color | adjustDarkModeColor: 'dark' | isLightColor)"
                  [class.text-dark]="color | adjustDarkModeColor: 'dark' | isLightColor"
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
  selector: 'system-colors-modal',
  imports: [AppAdjustDarkModeColor, AppIsLightColorPipe, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemColorsModal {
  activeModal = inject(NgbActiveModal);
  theme = inject(ThemeService).currentTheme;

  readonly colors = systemColors;
}
