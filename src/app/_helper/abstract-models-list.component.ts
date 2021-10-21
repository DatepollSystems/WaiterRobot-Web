import {Component, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractComponent, AbstractEntity, EntityList, IList, LoggerFactory} from 'dfx-helper';

import {compare, SortableHeaderDirective, SortEvent} from '../_shared/table-sortable';
import {AbstractModelService} from '../_services/abstract-model.service';

import {QuestionDialogComponent} from '../_shared/question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends AbstractEntity<number>> extends AbstractComponent {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  @ViewChildren(SortableHeaderDirective) public headers: QueryList<SortableHeaderDirective> | undefined;
  public filter = new FormControl('');

  public entities!: IList<EntityType>;
  public entitiesCopy!: IList<EntityType>;
  public entitiesLoaded = false;

  protected constructor(protected modelService: AbstractModelService<EntityType>, protected modal: NgbModal) {
    super();
    this.initializeVariables();

    this.filter.valueChanges.subscribe((value) => {
      if (value == null) {
        this.entitiesCopy = this.entities.clone();
        return;
      }
      value = value.trim().toLowerCase();
      this.entitiesCopy = new EntityList<EntityType>();
      for (const model of this.entities) {
        if (this.checkFilterForModel(value, model) !== undefined) {
          this.entitiesCopy.push(model);
        }
      }
    });
  }

  protected initializeVariables(): void {
    this.entities = this.modelService.getAll();
    this.entitiesCopy = this.entities.clone();
    if (this.entities.length > 0) {
      this.entitiesLoaded = true;
    }
    this.autoUnsubscribe(
      this.modelService.allChange.subscribe((value) => {
        this.entities = value;
        this.entitiesCopy = this.entities.clone();
        this.entitiesLoaded = true;
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkFilterForModel(filter: string, model: EntityType): EntityType | undefined {
    this.lumber.warning('checkFilterForModel', 'Not implemented!');
    return undefined;
  }

  public onDelete(modelId: number): void {
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.modelService.delete(modelId);
      }
    });
  }

  public onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.entitiesCopy = this.entities.clone();
    } else {
      this.entitiesCopy = new EntityList<EntityType>(
        [...this.entities].sort((a, b) => {
          const res = compare((a as any)[column], (b as any)[column]);
          return direction === 'asc' ? res : -res;
        })
      );
    }
  }
}
