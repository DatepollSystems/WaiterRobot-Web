import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import {AbstractEntityWithName, EntityList, IList} from 'dfx-helper';

@Component({
  selector: 'app-bootstrap-chip-input',
  templateUrl: './bootstrap-chip-input.component.html',
  styleUrls: ['./bootstrap-chip-input.component.scss'],
})
export class BootstrapChipInputComponent implements OnChanges {
  loaded = true;
  formatter = (result: AbstractEntityWithName<number>): string => result.name;
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
  models: IList<AbstractEntityWithName<number>> = new EntityList();

  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allModelsToAutoComplete: IList<AbstractEntityWithName<number>> = new EntityList();

  @Output()
  valueChange = new EventEmitter<IList<AbstractEntityWithName<number>>>();

  ngOnChanges(): void {
    this.allModelsToAutoComplete.removeIfPresent(this.models);
  }

  search: (text$: Observable<string>) => Observable<AbstractEntityWithName<number>[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) => this.allModelsToAutoComplete.filter((event) => new RegExp(term, 'mi').test(event.name)).slice(0, 10))
    );

  remove(value: AbstractEntityWithName<number>): void {
    this.models.removeIfPresent(value);
    this.allModelsToAutoComplete.addIfAbsent(value);
    this.emitChange();
  }

  selectModel(event: any): void {
    const model = event.item;
    if (!model) {
      return;
    }
    console.log('Model detected!');
    this.addValue(model);
    this.formCtrl = new FormControl('');
  }

  private addValue(value: AbstractEntityWithName<number>) {
    this.allModelsToAutoComplete.removeIfPresent(value);
    this.models.add(value);
    this.emitChange();
  }

  private emitChange() {
    this.valueChange.emit(this.models.clone());
  }
}
