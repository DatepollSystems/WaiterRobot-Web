import {Component, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import {AbstractEntityWithName, ArrayHelper} from 'dfx-helper';

@Component({
  selector: 'app-bootstrap-chip-input',
  templateUrl: './bootstrap-chip-input.component.html',
  styleUrls: ['./bootstrap-chip-input.component.scss'],
})
export class BootstrapChipInputComponent implements OnChanges {
  loaded = true;
  formatter = (result: AbstractEntityWithName<number>) => result.name;
  formCtrl = new FormControl();

  /**
   * Key of translation string in language files.
   * Take a look at de.json
   */
  @Input()
  label = 'Input';
  /**
   * Key of translation string in language files.
   */
  @Input()
  placeHolder = 'ADD';

  /**
   * Already filled in strings
   */
  @Input()
  models: AbstractEntityWithName<number>[] = [];

  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allModelsToAutoComplete: AbstractEntityWithName<number>[] = [];

  @Output()
  valueChange = new EventEmitter<AbstractEntityWithName<number>[]>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const list = [];
    for (const model of this.models) {
      for (const allModel of this.allModelsToAutoComplete) {
        if (model.id === allModel.id) {
          list.push(allModel);
          break;
        }
      }
    }
    for (const model of list) {
      const i = this.allModelsToAutoComplete.indexOf(model);
      this.allModelsToAutoComplete.splice(i, 1);
    }
  }

  search: (text$: Observable<string>) => Observable<AbstractEntityWithName<number>[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) => this.allModelsToAutoComplete.filter((event) => new RegExp(term, 'mi').test(event.name)).slice(0, 10))
    );

  remove(value: AbstractEntityWithName<number>) {
    this.models = ArrayHelper.removeEntityIfPresent(this.models, value);
    this.allModelsToAutoComplete = ArrayHelper.addEntityIfAbsent(this.allModelsToAutoComplete, value);
    this.emitChange();
  }

  selectModel(event: any) {
    const model = event.item;
    if (!model) {
      return;
    }
    console.log('Model detected!');
    this.addValue(model);
    this.formCtrl = new FormControl('');
  }

  private addValue(value: AbstractEntityWithName<number>) {
    this.allModelsToAutoComplete = ArrayHelper.removeEntityIfPresent(this.allModelsToAutoComplete, value);
    this.models.push(value);
    this.emitChange();
  }

  private emitChange() {
    this.valueChange.emit(this.models.slice());
  }
}