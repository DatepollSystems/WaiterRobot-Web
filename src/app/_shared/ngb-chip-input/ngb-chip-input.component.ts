import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngb-chip-input',
  templateUrl: './ngb-chip-input.component.html',
  styleUrls: ['./ngb-chip-input.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NgbChipInput {
  formCtrl = new UntypedFormControl();

  inputValid = true;
  @Input() filter: ((input: string) => boolean) | undefined;

  /**
   * Key of translation string in language files.
   * Take a look at de.json
   */
  @Input() label: string | undefined;
  /**
   * Key of translation string in language files.
   */
  @Input() placeHolder = 'ADD';

  @Input() validationErrorText = 'Error text';

  /**
   * Already filled in strings
   */
  @Input() models: string[] = [];

  @Output() valueChange = new EventEmitter<string[]>();

  constructor() {}

  private emitChange(): void {
    console.log(this.models);
    this.valueChange.emit(this.models.slice());
  }

  inputChange(input: string): void {
    if (this.filter != undefined && input) {
      if (input.includes(',')) {
        input = input.replace(',', '');
        this.formCtrl.setValue(input);
        this.add();
      }

      this.inputValid = this.filter(input) || input.length < 1;
    }
  }

  remove(value: string): void {
    this.models.splice(this.models.indexOf(value), 1);
    this.emitChange();
  }

  add(): void {
    if (!this.inputValid) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.models.push(this.formCtrl.value);
    this.emitChange();
    this.formCtrl.reset();
  }
}
