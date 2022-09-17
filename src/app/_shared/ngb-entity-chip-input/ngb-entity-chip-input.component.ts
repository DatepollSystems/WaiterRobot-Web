import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {EntityList, IEntityList, IEntityWithName, IHasName, LoggerFactory, StringOrNumber} from 'dfx-helper';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';

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

  @Input() set showOnClick(value: BooleanInput) {
    this._showOnClick = coerceBooleanProperty(value);
  }
  _showOnClick = false;

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

  _models: IEntityList<IEntityWithName<StringOrNumber>> = new EntityList();
  _allModelsToAutoComplete: IEntityList<IEntityWithName<StringOrNumber>> = new EntityList();

  @Output() valueChange = new EventEmitter<IEntityList<IEntityWithName<StringOrNumber>>>();

  @ViewChild('instance', {static: true}) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  formatter = (result: IHasName): string => result.name;
  search: (text$: Observable<string>) => Observable<IHasName[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(100), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
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
  };

  /**
   * Already filled in strings
   */
  @Input()
  public set models(models: IEntityList<IEntityWithName<StringOrNumber>> | undefined) {
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
  public set allModelsToAutoComplete(models: IEntityList<IEntityWithName<StringOrNumber>>) {
    this._allModelsToAutoComplete.set(models);
    this.logger.info('set auto', 'Models to autocomplete', this._allModelsToAutoComplete);
  }

  private emitChange(): void {
    this.logger.info('emitChange', 'Models', this._models);
    this.valueChange.emit(this._models.clone() as IEntityList<IEntityWithName<StringOrNumber>>);
  }

  selectModel(event: NgbTypeaheadSelectItemEvent<IEntityWithName<StringOrNumber>>): void {
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

  remove(value: IEntityWithName<StringOrNumber>): void {
    this._models.remove(value);
    this.emitChange();
  }
}
