import {computed, Directive, inject, input} from '@angular/core';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppIsLightColorPipe} from '@home-shared/components/color/app-is-light-color.pipe';
import {ThemeService} from '@shared/services/theme.service';

@Directive({
  selector: '[app-text-color-by-background]',
  standalone: true,
  host: {
    '[class.text-white]': 'textWhite()',
    '[class.text-dark]': 'textBlack()',
    '[class.text-body-emphasis]': 'textEmphasis()',
  },
})
export class AppTextColorByBackgroundDirective {
  color = input.required<string | undefined | null>();

  adjustDarkMode = new AppAdjustDarkModeColor();
  isLightColor = new AppIsLightColorPipe();
  theme = inject(ThemeService).currentTheme;

  textWhite = computed(() => this.color() && !this.isLightColor.transform(this.adjustDarkMode.transform(this.color(), this.theme().id)));
  textBlack = computed(() => this.color() && this.isLightColor.transform(this.adjustDarkMode.transform(this.color(), this.theme().id)));
  textEmphasis = computed(() => !this.color());
}
