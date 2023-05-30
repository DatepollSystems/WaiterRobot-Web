import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {dfxTranslateSetLanguage, TranslateStore} from 'dfx-translate';
import {QuestionDialogComponent} from '../question-dialog/question-dialog.component';

@Component({
  template: `
    <footer id="footerContainer" class="unselectable">
      <div class="container-fluid">
        <div class="{{ container }} footerHeaderContainer">
          <div class="d-flex flex-column flex-md-row justify-content-between">
            <div>
              <h3>
                <a href="https://kellner.team" rel="noopener" target="_blank" class="text-white">kellner.team</a>
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
                    <!-- Set everywhere text-white class; Bug on macOs where text is not visible -->
                    <select class="form-select" id="changeLanguage" [ngModel]="selected$ | async" (ngModelChange)="setLang($event)">
                      <option value="de">{{ 'LANGUAGE_GERMAN' | tr }}</option>
                      <!--                  <option value="en">{{ 'LANGUAGE_ENGLISH' | tr }}</option>-->
                      <!--                  <option value="es">{{ 'LANGUAGE_SPANISH' | tr }}</option>-->
                      <!--                  <option value="fr">{{ 'LANGUAGE_FRANCE' | tr }}</option>-->
                      <!--                  <option value="it">{{ 'LANGUAGE_ITALIEN' | tr }}</option>-->
                      <!--                  <option value="pt">{{ 'LANGUAGE_PORTUGUES' | tr }}</option>-->
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
          <div class="{{ container }}">
            <div class="d-flex flex-column flex-md-row justify-content-between">
              <div class="d-flex align-items-center gap-1">
                <div>Made with</div>
                <div style="font-size: 16px; color: red" (click)="heart()">♥</div>
                <div>
                  by
                  <a class="text-white" href="https://datepollsystems.org" rel="noopener" target="_blank">DatePoll-Systems</a>
                </div>
              </div>

              <div class="d-flex align-items-center">
                <a class="text-white" routerLink="/info/imprint"> {{ 'ABOUT_IMPRINT' | tr }} & {{ 'ABOUT_PRIVACY_POLICY' | tr }}</a>
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
        background-color: var(--primary-7);
        color: white;
      }

      .footerHeaderContainer {
        padding-top: 18px;
        padding-bottom: 15px;
      }

      #footerBarContainer {
        background-color: var(--primary-8);
        padding-top: 18px;
        padding-bottom: 15px;
        color: rgba(255, 255, 255, 0.8);
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        color: white;
        text-align: end;
      }

      li a {
        color: #eeeeee;
      }

      li a:hover {
        color: #bdbdbd;
        cursor: pointer;
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

  constructor(private modal: NgbModal) {}

  heart(): void {
    document.getElementById('brand')?.classList.add('spin');
  }

  setLang(event: string): void {
    // const oldLanguage = localStorage.getItem('language');
    this.setLanguage(event);

    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'md'});
    modalRef.componentInstance.title = 'LANGUAGE_RELOAD';
    void modalRef.result.then((result) => {
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        window.location.reload();
      }
    });

    // const snackBarRef = this.snackBar.open(this.transslate.translate('LANGUAGE_CHANGED_TO') + this.selected, 'Undo');
    // snackBarRef.onAction().subscribe(() => {
    //   this.selected = oldLanguage;
    //   this.translate.use(oldLanguage);
    //   this.snackBar.open(this.translate.translate('LANGUAGE_RESET'));
    //   console.log('Language was changed via undo to ' + this.selected);
    // });
  }
}
