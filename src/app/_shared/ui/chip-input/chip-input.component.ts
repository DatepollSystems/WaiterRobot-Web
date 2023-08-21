/* eslint-disable @typescript-eslint/no-redundant-type-constituents,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return */
import {BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, numberAttribute, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {NgbModule, NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {s_is} from 'dfts-helper';

import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, Subject} from 'rxjs';

import {AppIconsModule} from '../icons.module';

type inputType = any | string;
type inputTypes = inputType[];

@Component({
  selector: 'chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, AppIconsModule],
})
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

  @Input({transform: numberAttribute}) maxSearchResults = 10;

  /**
   * Already filled in strings
   */
  @Input()
  public set models(models: inputTypes | undefined) {
    if (!models) {
      return;
    }
    this._models = models.sort((a, b) => this.formatter(a).localeCompare(this.formatter(b)));
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

  @ViewChild('instance', {static: true}) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: (text$: Observable<string>) => Observable<inputTypes> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(this._debounceTime), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, clicksWithClosedPopup$, inputFocus$).pipe(
      filter((term) => term.length >= this._minInputLengthKick),
      map((term) => {
        if (!this._allModelsToAutoComplete) {
          return [];
        }

        return this._allModelsToAutoComplete
          .filter((event: inputType) => {
            const formattedEvent = this.formatter(event);
            for (const model of this._models) {
              if (this.formatter(model) === formattedEvent) {
                return false;
              }
            }
            return term === '' ? true : new RegExp(term, 'mi').test(this.formatter(event));
          })
          .slice(0, this.maxSearchResults);
      }),
    );
  };

  validate = (input: string): boolean => (this.validator != undefined ? this.validator(input) : true) && input.length > 0;

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
    this._models = this._models.sort((a, b) => this.formatter(a).localeCompare(this.formatter(b)));
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
    if (!input || !s_is(input)) {
      return;
    }

    if (input.includes(',')) {
      return;
    }

    this.inputValid = this.validate(input);
  }

  add(): void {
    let input = this.formCtrl.value as string | undefined;

    if (!input || input === '' || input === ' ') {
      this.inputValid = false;
      return;
    }

    if (!s_is(input)) {
      return;
    }

    input = input.replace(',', '');

    if (!this.validate(input)) {
      return;
    }

    input = input.toLowerCase().trim();

    const item = this._allModelsToAutoComplete?.find((it) => this.formatter(it).toLowerCase().trim() === (input as string));
    if (!item && this._allModelsToAutoComplete) {
      return;
    }
    this._models.push(item ?? input);
    this._models = this._models.sort((a, b) => this.formatter(a).localeCompare(this.formatter(b)));
    this.emitChange();
    this.inputValid = true;
    this.formCtrl.reset();
  }
}
