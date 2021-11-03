import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import {EntityList, IEntityWithNumberIDAndName, IHasName, IList} from 'dfx-helper';

@Component({
  selector: 'app-bootstrap-chip-input',
  templateUrl: './bootstrap-chip-input.component.html',
  styleUrls: ['./bootstrap-chip-input.component.scss'],
})
export class BootstrapChipInputComponent implements OnChanges {
  loaded = true;
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
  models: IList<IEntityWithNumberIDAndName> = new EntityList();
  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allModelsToAutoComplete: IList<IEntityWithNumberIDAndName> = new EntityList();
  @Output()
  valueChange = new EventEmitter<IList<IEntityWithNumberIDAndName>>();

  private emitChange(): void {
    this.valueChange.emit(this.models.clone());
  }

  formatter = (result: IHasName): string => result.name;

  search: (text$: Observable<string>) => Observable<IHasName[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) => this.allModelsToAutoComplete.filter((event) => new RegExp(term, 'mi').test(event.name)).slice(0, 10))
    );

  ngOnChanges(): void {
    this.allModelsToAutoComplete.removeIfPresent(this.models);
  }

  remove(value: IEntityWithNumberIDAndName): void {
    this.models.removeIfPresent(value);
    this.allModelsToAutoComplete.addIfAbsent(value);
    this.emitChange();
  }

  selectModel(event: any): void {
    const model = event.item;
    if (!model) {
      return;
    }
    this.allModelsToAutoComplete.removeIfPresent(model);
    this.models.add(model);
    this.emitChange();
    this.formCtrl = new FormControl('');
  }
}
