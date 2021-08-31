import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Observable, OperatorFunction} from 'rxjs';

@Component({
  selector: 'app-bootstrap-chip-input',
  templateUrl: './bootstrap-chip-input.component.html',
  styleUrls: ['./bootstrap-chip-input.component.scss']
})
export class BootstrapChipInputComponent implements OnInit {
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
  models: any[] = [];
  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allModelsToAutoComplete: any[] = [];
  @Output()
  valueChange = new EventEmitter<any[]>();

  /**
   * Name of property for filtering
   */
  @Input()
  filter = 'id';

  model: any;

  constructor() {
  }

  ngOnInit(): void {
    console.log('List to autocomplete:');
    console.log(this.allModelsToAutoComplete);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allModelsToAutoComplete.filter(v => v[this.filter].toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));

  remove(string: string) {
    const i = this.models.indexOf(string);
    this.models.splice(i, 1);
    this.emitChange();
  }

  private addValue(value: string) {
    value = value.trim();
    this.models.push(value);
    this.emitChange();
  }

  private emitChange() {
    this.valueChange.emit(this.models.slice());
  }

}
