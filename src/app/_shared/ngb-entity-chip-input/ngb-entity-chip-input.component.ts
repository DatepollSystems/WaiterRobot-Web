import {Component, EventEmitter, Input, Output} from '@angular/core';

import {EntityList, IEntityList, IEntityWithNumberIDAndName, IHasName, LoggerFactory} from 'dfx-helper';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngb-entity-chip-input',
  templateUrl: './ngb-entity-chip-input.component.html',
  styleUrls: ['./ngb-entity-chip-input.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NgbEntityChipInput {
  loaded = true;
  modelName = '';

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
  _models: IEntityList<IEntityWithNumberIDAndName> = new EntityList();
  _allModelsToAutoComplete: IEntityList<IEntityWithNumberIDAndName> = new EntityList();
  @Output() valueChange = new EventEmitter<IEntityList<IEntityWithNumberIDAndName>>();
  formatter = (result: IHasName): string => result.name;
  search: (text$: Observable<string>) => Observable<IHasName[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this._allModelsToAutoComplete.filter((event) => {
          if (this._models.containsAny(event)) {
            return false;
          }
          return new RegExp(term, 'mi').test(event.name);
        })
      )
    );

  /**
   * Already filled in strings
   */
  @Input()
  public set models(models: IEntityList<IEntityWithNumberIDAndName> | undefined) {
    if (models == undefined) {
      return;
    }
    this._models.set(models);
    this.logger.info('set models', 'Models', this._models);
  }

  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  public set allModelsToAutoComplete(models: IEntityList<IEntityWithNumberIDAndName>) {
    this._allModelsToAutoComplete.set(models);
    this.logger.info('set auto', 'Models to autocomplete', this._allModelsToAutoComplete);
  }

  private emitChange(): void {
    this.logger.info('emitChange', 'Models', this._models);
    this.valueChange.emit(this._models.clone() as IEntityList<IEntityWithNumberIDAndName>);
  }

  selectModel(event: any): void {
    const model = event.item;
    if (model == null) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this._models.add(model);
    this.emitChange();
    this.modelName = ' ';
    setTimeout(() => (this.modelName = ''), 2);
  }

  remove(value: IEntityWithNumberIDAndName): void {
    this._models.removeIfPresent(value);
    this.emitChange();
  }
}
