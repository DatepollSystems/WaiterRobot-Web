import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import {EntityList, IEntityWithNumberIDAndName, IHasName, IList, LoggerFactory} from 'dfx-helper';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngb-entity-chip-input',
  templateUrl: './ngb-entity-chip-input.component.html',
  styleUrls: ['./ngb-entity-chip-input.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NgbEntityChipInput {
  loaded = true;
  formCtrl = new FormControl();

  logger = LoggerFactory.getLogger('NgbEntityChipInput');

  @Input() dark = false;

  /**
   * Key of translation string in language files.
   * Take a look at de.json
   */
  @Input() label = 'Input';
  /**
   * Key of translation string in language files.
   */
  @Input() placeHolder = 'ADD';

  /**
   * Already filled in strings
   */
  @Input()
  public set models(models: IList<IEntityWithNumberIDAndName> | undefined) {
    if (models == undefined) {
      return;
    }
    this._models = models;
    this._allModelsToAutoComplete.removeIfPresent(this._models);
    this.logger.info('set models', 'Models', this._models);
    this.logger.info('set models', 'Models to autocomplete', this._allModelsToAutoComplete);
  }

  _models: IList<IEntityWithNumberIDAndName> = new EntityList();

  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  public set allModelsToAutoComplete(models: IList<IEntityWithNumberIDAndName>) {
    this._allModelsToAutoComplete = models;
    this._allModelsToAutoComplete.removeIfPresent(this._models);
    this.logger.info('set auto', 'Models to autocomplete', this._allModelsToAutoComplete);
  }

  _allModelsToAutoComplete: IList<IEntityWithNumberIDAndName> = new EntityList();
  @Output() valueChange = new EventEmitter<IList<IEntityWithNumberIDAndName>>();

  private emitChange(): void {
    this.logger.info('emitChange', 'Models', this._models);
    this.valueChange.emit(this._models.clone());
  }

  formatter = (result: IHasName): string => result.name;

  search: (text$: Observable<string>) => Observable<IHasName[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) => this._allModelsToAutoComplete.filter((event) => new RegExp(term, 'mi').test(event.name)))
    );

  remove(value: IEntityWithNumberIDAndName): void {
    this._models.removeIfPresent(value);
    this._allModelsToAutoComplete.addIfAbsent(value);
    this.emitChange();
  }

  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  selectModel(event: any): void {
    const model = event.item;
    if (model == null) {
      return;
    }
    this._allModelsToAutoComplete.removeIfPresent(model);
    this._models.add(model);
    this.emitChange();
    this.formCtrl.reset();
  }
}
