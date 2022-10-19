import {BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {NgbModule, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {TypeHelper} from 'dfx-helper';

import {debounceTime, distinctUntilChanged, filter, map, Observable} from 'rxjs';

import {IconsModule} from '../icons.module';

type inputType = any | string;
type inputTypes = inputType[];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, IconsModule],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ChipInput {
  formCtrl = new UntypedFormControl();
  modelInput = '';

  inputValid = true;
  @Input() validator?: (input: string) => boolean;
  @Input() label?: string;
  @Input() placeholder = 'Add';
  @Input() validationErrorText = 'Error text';

  @Input() set dark(it: BooleanInput) {
    this._dark = coerceBooleanProperty(it);
  }

  _dark = false;

  @Input() set debounceTime(it: NumberInput) {
    this._debounceTime = coerceNumberProperty(it);
  }

  _debounceTime = 200;

  @Input() set minInputLengthKick(it: NumberInput) {
    this._minInputLengthKick = coerceNumberProperty(it);
  }

  _minInputLengthKick = 1;

  /**
   * Already filled in strings
   */
  @Input()
  public set models(models: inputTypes) {
    this._models = models;
  }

  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  public set allModelsToAutoComplete(models: inputTypes) {
    this._allModelsToAutoComplete = models;
  }

  _models: inputTypes = [];
  _allModelsToAutoComplete?: inputTypes;

  @Input() set editable(it: BooleanInput) {
    this._editable = coerceBooleanProperty(it);
  }
  _editable = true;

  @Input()
  formatter: <T>(it: T) => string = (it) => it as unknown as string;

  search: (text$: Observable<string>) => Observable<inputTypes> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(this._debounceTime),
      distinctUntilChanged(),
      filter((term) => term.length >= this._minInputLengthKick),
      map((term) => {
        if (!this._allModelsToAutoComplete) {
          return [];
        }

        return this._allModelsToAutoComplete.filter((event: inputType) => {
          const formattedEvent = this.formatter(event);
          for (const model of this._models) {
            if (this.formatter(model) === formattedEvent) {
              return false;
            }
          }
          return new RegExp(term, 'mi').test(this.formatter(event));
        });
      })
    );

  validate = (input: string) => (this.validator != undefined ? this.validator(input) : true) && input.length > 0;

  @Output() valueChange = new EventEmitter<inputTypes>();

  constructor() {}

  private emitChange(): void {
    console.log(this._models);
    this.valueChange.emit(this._models.slice());
  }

  selectModel(event: NgbTypeaheadSelectItemEvent<inputType>): void {
    const model = event.item;
    if (model == null) {
      return;
    }
    this._models.push(model);
    this.emitChange();
    this.inputValid = true;
    this.modelInput = ' ';
    window.setTimeout(() => (this.modelInput = ''), 10);
  }

  remove(value: string): void {
    this._models.splice(this._models.indexOf(value), 1);
    this.emitChange();
  }

  inputChange(input?: inputType): void {
    if (!input || !TypeHelper.isString(input)) {
      return;
    }

    if (input.includes(' ') || input.includes(',')) {
      return;
    }

    this.inputValid = this.validate(input);
  }

  add(): void {
    let input = this.formCtrl.value as string | undefined;

    if (!input) {
      this.inputValid = false;
      return;
    }

    input = input.replace(' ', '');
    input = input.replace(',', '');

    if (!this.validate(input)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._models.push(input);
    this.emitChange();
    this.inputValid = true;
    this.formCtrl.reset();
  }
}
