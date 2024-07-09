import {Directive, effect, HostBinding, inject, input} from '@angular/core';
import {ThemeService} from '@shared/services/theme.service';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppIsLightColorPipe} from '@home-shared/components/color/app-is-light-color.pipe';

@Directive({
  selector: '[app-text-color-by-background]',
  standalone: true,
})
export class AppTextColorByBackgroundDirective {
  color = input.required<string | undefined | null>();

  adjustDarkMode = new AppAdjustDarkModeColor();
  isLightColor = new AppIsLightColorPipe();
  theme = inject(ThemeService).currentTheme;

  @HostBinding('class.text-white') textWhite = false;
  @HostBinding('class.text-dark') textBlack = false;
  @HostBinding('class.text-body-emphasis') textEmphasis = false;

  constructor() {
    effect(() => {
      const theme = this.theme().id;
      const color = this.color();

      if (!color) {
        this.textEmphasis = true;
        this.textWhite = false;
        this.textBlack = false;

        return;
      }

      this.textEmphasis = false;

      if (this.isLightColor.transform(this.adjustDarkMode.transform(color, theme))) {
        this.textBlack = true;
        this.textWhite = false;
      } else {
        this.textBlack = false;
        this.textWhite = true;
      }
    });
  }
}
