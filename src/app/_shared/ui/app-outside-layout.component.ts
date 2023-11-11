import {ChangeDetectionStrategy, Component} from '@angular/core';

import {AppLogoWithTextComponent} from './app-logo-with-text.component';
import {FooterModule} from './footer/footer.module';
import {ThemePickerComponent} from '../../home/theme.component';

@Component({
  template: `
    <div class="d-container">
      <div class="container-md d-flex flex-column align-items-center gap-5">
        <app-logo-with-text />
        <div class="col-12 col-sm-10 col-md-9 co-lg-8 col-xl-6 d-flex flex-column align-items-center gap-4">
          <ng-content />
        </div>
      </div>
    </div>
    <app-footer container="container-md" />
  `,
  styles: [
    `
      .d-container {
        min-height: 95%;
        background-color: var(--primary-9);
        padding-top: 6%;
        padding-bottom: 6%;
      }
    `,
  ],
  selector: 'outside-layout-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoWithTextComponent, FooterModule, ThemePickerComponent],
  standalone: true,
})
export class AppOutsideLayoutComponent {}
