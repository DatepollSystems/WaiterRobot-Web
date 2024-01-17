import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {injectWindow} from 'dfx-helper';
import {dfxTranslateSetLanguage, TranslateStore} from 'dfx-translate';

@Component({
  template: `
    <footer id="footerContainer" class="unselectable">
      <div class="container-fluid">
        <div class="my-container {{ container }} footerHeaderContainer">
          <div class="d-flex flex-column flex-md-row justify-content-between">
            <div>
              <h3>
                <a class="link-body-emphasis" href="https://kellner.team" rel="noopener" target="_blank">kellner.team</a>
              </h3>
            </div>
            <div class="col-md-2">
              <ul>
                <li>
                  <app-about-modal />
                </li>
                <li>
                  <label for="changeLanguage">{{ 'LANGUAGE' | tr }}</label>
                  <div class="input-group">
                    <select class="form-select" id="changeLanguage" [ngModel]="selected$ | async" (ngModelChange)="setLang($event)">
                      <option value="de">{{ 'LANGUAGE_GERMAN' | tr }}</option>
                      <option value="en">{{ 'LANGUAGE_ENGLISH' | tr }}</option>
                      <option value="es">{{ 'LANGUAGE_SPANISH' | tr }}</option>
                      <option value="fr">{{ 'LANGUAGE_FRANCE' | tr }}</option>
                      <option value="it">{{ 'LANGUAGE_ITALIEN' | tr }}</option>
                      <option value="pt">{{ 'LANGUAGE_PORTUGUES' | tr }}</option>
                    </select>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="footerBarContainer">
        <div class="container-fluid">
          <div class="my-container {{ container }}">
            <div class="d-flex flex-column flex-md-row justify-content-between">
              <div class="d-flex align-items-center gap-1">
                <div>Made with</div>
                <div class="heart" (click)="heart()">♥</div>
                <div>by Alex, Dominik & Fabian</div>
              </div>
              <div class="d-flex align-items-center">
                <a class="link-body-emphasis" routerLink="/info/imprint"> {{ 'ABOUT_IMPRINT' | tr }} & {{ 'ABOUT_PRIVACY_POLICY' | tr }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      #footerContainer {
        background-color: var(--bs-tertiary-bg);
      }

      .footerHeaderContainer {
        padding-top: 18px;
        padding-bottom: 15px;
      }

      #footerBarContainer {
        padding-top: 18px;
        padding-bottom: 15px;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        text-align: end;
      }

      .heart {
        font-size: 16px;
        color: red;
      }

      .heart:hover {
        transform: scale(1.4);
      }
    `,
  ],
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  selected$ = inject(TranslateStore).selectedLanguage$;
  setLanguage = dfxTranslateSetLanguage();

  @Input()
  container = 'container-xxxl';

  window = injectWindow();

  heart(): void {
    document.getElementById('brand')?.classList.add('spin');
  }

  setLang(event: string): void {
    // const oldLanguage = localStorage.getItem('language');
    this.setLanguage(event);
    this.window?.location.reload();

    // const snackBarRef = this.snackBar.open(this.transslate.translate('LANGUAGE_CHANGED_TO') + this.selected, 'Undo');
    // snackBarRef.onAction().subscribe(() => {
    //   this.selected = oldLanguage;
    //   this.translate.use(oldLanguage);
    //   this.snackBar.open(this.translate.translate('LANGUAGE_RESET'));
    //   console.log('Language was changed via undo to ' + this.selected);
    // });
  }
}
