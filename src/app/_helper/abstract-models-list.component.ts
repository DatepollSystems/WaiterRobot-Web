import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractComponent, AbstractEntity, EntityList, IList, List, LoggerFactory} from 'dfx-helper';

import {compare, SortableHeaderDirective, SortEvent} from '../_shared/table-sortable';
import {AbstractModelService} from '../_services/abstract-model.service';

import {QuestionDialogComponent} from '../_shared/question-dialog/question-dialog.component';
import {NgbTableDataSource} from '../_shared/table/data-source';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends AbstractEntity<number>> extends AbstractComponent implements OnInit {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  @ViewChildren(SortableHeaderDirective) public headers: QueryList<SortableHeaderDirective> | undefined;
  public filter = new FormControl();

  public entities: IList<EntityType> = new List();
  public entitiesCopy: IList<EntityType> = new List();
  public dataSource: NgbTableDataSource<EntityType> = new NgbTableDataSource();
  public entitiesLoaded = false;

  protected constructor(protected entitiesService: AbstractModelService<EntityType>, protected modal: NgbModal) {
    super();

    this.filter.valueChanges.subscribe((value) => {
      this.dataSource.filter = value;
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

  protected initializeEntities(): void {
    this.entities = this.entitiesService.getAll();
    this.entitiesCopy = this.entities.clone();
    this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
    // Don't check because events waiters and org waiters use same list
    // if (this.entities.length > 0) {
    //   this.entitiesLoaded = true;
    // }
    this.autoUnsubscribe(
      this.entitiesService.allChange.subscribe((value) => {
        this.entities = value;
        this.entitiesCopy = this.entities.clone();
        this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
        this.entitiesLoaded = true;
      })
    );
  }

  ngOnInit(): void {
    this.initializeEntities();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkFilterForModel(filter: string, model: EntityType): EntityType | undefined {
    this.lumber.warning('checkFilterForModel', 'Not implemented!');
    return undefined;
  }

  public onDelete(modelId: number): void {
    this.lumber.info('onDelete', 'Opening delete question dialog');
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.entitiesService.delete(modelId);
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
        this.entities.sort((a, b) => {
          const res = compare((a as any)[column], (b as any)[column]);
          return direction === 'asc' ? res : -res;
        })
      );
      this.dataSource = new NgbTableDataSource<EntityType>(this.entitiesCopy);
    }
  }
}
