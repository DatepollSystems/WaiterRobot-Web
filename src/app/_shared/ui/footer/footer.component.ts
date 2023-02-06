import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {dfxTranslateSetLanguage, TranslateStore} from 'dfx-translate';
import {QuestionDialogComponent} from '../question-dialog/question-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  selected$ = inject(TranslateStore).selectedLanguage$;
  setLanguage = dfxTranslateSetLanguage();

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
