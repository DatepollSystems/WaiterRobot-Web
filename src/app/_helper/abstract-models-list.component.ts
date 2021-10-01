import {Component, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractComponent} from './abstract-component';
import {AbstractEntityWithName, LoggerFactory} from 'dfx-helper';

import {SortableHeader, SortEvent} from './table-sortable';
import {AbstractModelService} from '../_services/abstract-model.service';

import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends AbstractEntityWithName<number>> extends AbstractComponent {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  @ViewChildren(SortableHeader) headers: QueryList<SortableHeader> | undefined;
  public filter = new FormControl('');

  protected entities!: EntityType[];
  public entitiesCopy!: EntityType[];
  protected entitiesSubscription!: Subscription;
  public entitiesLoaded = false;

  protected constructor(protected modelService: AbstractModelService<EntityType>, protected modal: NgbModal) {
    super();
    this.initializeVariables();

    this.filter.valueChanges.subscribe((value) => {
      if (value == null) {
        this.entitiesCopy = this.entities.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.entitiesCopy = [];
      for (const model of this.entities) {
        if (this.checkFilterForModel(value, model) !== undefined) {
          this.entitiesCopy.push(model);
        }
      }
    });
  }

  protected initializeVariables(): void {
    this.entities = this.modelService.getAll();
    this.entitiesCopy = this.entities.slice();
    if (this.entities.length > 0) {
      this.entitiesLoaded = true;
    }
    this.autoUnsubscribe(
      this.modelService.allChange.subscribe((value) => {
        this.entities = value;
        this.entitiesCopy = this.entities.slice();
        this.entitiesLoaded = true;
      })
    );
  }

  protected checkFilterForModel(filter: string, model: EntityType): EntityType | undefined {
    this.lumber.warning('checkFilterForModel', 'Not implemented!');
    return undefined;
  }

  onDelete(modelId: number): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    modalRef.result.then(
      (result) => {
        if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
          this.modelService.delete(modelId);
        }
      },
      () => {}
    );
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.entitiesCopy = this.entities.slice();
    } else {
      this.entitiesCopy = [...this.entities].sort((a, b) => {
        // @ts-ignore
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
