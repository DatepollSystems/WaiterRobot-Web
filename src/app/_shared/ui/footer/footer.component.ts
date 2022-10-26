import {ChangeDetectionStrategy, Component} from '@angular/core';

import {TranslateService} from 'dfx-translate';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuestionDialogComponent} from '../question-dialog/question-dialog.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  selected: string;

  constructor(private translate: TranslateService, private modal: NgbModal) {
    this.selected = this.translate.getSelectedLanguage();
  }

  heart(): void {
    document.getElementById('brand')?.classList.add('spin');
  }

  setLang(event: string): void {
    // const oldLanguage = localStorage.getItem('language');
    void this.translate.use(event);

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
