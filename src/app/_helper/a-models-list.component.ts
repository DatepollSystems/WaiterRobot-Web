import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AModel, AModelService, LoggerFactory} from 'dfx-helper';

import {SortableHeader, SortEvent} from './table-sortable';

@Component({
  template: ''
})
export abstract class AModelsListComponent<Model extends AModel> implements OnDestroy {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;
  public filter = new FormControl('');

  private models: Model[];
  public modelsCopy: Model[];
  private modelsSubscription: Subscription;
  public modelsLoaded = false;

  protected constructor(private modelService: AModelService<Model>) {
    this.models = this.modelService.getAll();
    this.modelsCopy = this.models.slice();
    if (this.models.length > 0) {
      this.modelsLoaded = true;
    }
    this.modelsSubscription = this.modelService.allChange.subscribe(value => {
      this.models = value;
      this.modelsCopy = this.models.slice();
      this.modelsLoaded = true;
    });

    this.filter.valueChanges.subscribe(value => {
      if (value == null) {
        this.modelsCopy = this.models.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.modelsCopy = [];
      for (const model of this.models) {
        if (this.checkFilterForModel(value, model) !== undefined) {
          this.modelsCopy.push(model);
        }
      }
    });
  }

  protected checkFilterForModel(filter: string, model: Model): Model | undefined {
    this.lumber.warning('checkFilterForModel', 'Not implemented!');
    return undefined;
  }

  ngOnDestroy(): void {
    this.modelsSubscription.unsubscribe();
  }

  onDelete(id: number): void {
    this.modelService.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.modelsCopy = this.models.slice();
    } else {
      this.modelsCopy = [...this.models].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
