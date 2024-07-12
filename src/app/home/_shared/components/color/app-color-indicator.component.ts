import {NgStyle} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {ThemeService} from '@shared/services/theme.service';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';

@Component({
  template: `
    {{ '' }}
    <div
      [ngStyle]="{
        width: size() + 'px',
        height: size() + 'px',
        backgroundColor: color() | adjustDarkModeColor: theme().id,
        borderRadius: '50px',
      }"
    ></div>
  `,
  standalone: true,
  selector: 'app-color-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, AppAdjustDarkModeColor],
})
export class AppColorIndicatorComponent {
  color = input.required<string>();

  size = input(20);

  theme = inject(ThemeService).currentTheme;
}
