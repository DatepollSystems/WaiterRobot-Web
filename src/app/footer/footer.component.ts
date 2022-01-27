import {Component} from '@angular/core';

import {TranslateService} from 'dfx-translate';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  selected: string | null;

  constructor(private translate: TranslateService) {
    this.selected = localStorage.getItem('language');
    if (this.selected == null) {
      this.selected = 'de';
    }
  }

  setLang(event: any): void {
    // const oldLanguage = localStorage.getItem('language');
    void this.translate.use(event);

    // const snackBarRef = this.snackBar.open(this.translate.translate('LANGUAGE_CHANGED_TO') + this.selected, 'Undo');
    // snackBarRef.onAction().subscribe(() => {
    //   this.selected = oldLanguage;
    //   this.translate.use(oldLanguage);
    //   this.snackBar.open(this.translate.translate('LANGUAGE_RESET'));
    //   console.log('Language was changed via undo to ' + this.selected);
    // });
  }
}
