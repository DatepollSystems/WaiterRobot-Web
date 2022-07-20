import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {AComponent, AEntityService, IEntity, IList, List, LoggerFactory, StringOrNumber} from 'dfx-helper';

import {QuestionDialogComponent} from '../_shared/question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends IEntity<StringOrNumber>> extends AComponent implements OnInit {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  // Table stuff
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;
  @ViewChild(NgbPaginator, {static: true}) paginator: NgbPaginator | undefined;
  protected abstract columnsToDisplay: string[];
  public filter = new UntypedFormControl();
  public dataSource: NgbTableDataSource<EntityType> = new NgbTableDataSource();

  public entities: IList<EntityType> = new List();
  public entitiesLoaded = false;

  protected constructor(protected modal: NgbModal, protected entitiesService: AEntityService<StringOrNumber, EntityType>) {
    super();

    this.filter.valueChanges.subscribe((value) => {
      this.dataSource.filter = value;
    });
  }

  ngOnInit(): void {
    this.initializeEntities();
  }

  protected onEntitiesLoaded(): void {}

  protected initializeEntities(): void {
    this.entities = this.entitiesService.getAll();
    if (this.entities.length > 0) {
      this.onEntitiesLoaded();
    }
    this.lumber.info('initializeEntities', 'Entities loaded', this.entities);
    this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // Don't check because events waiters and org waiters use same list
    // if (this.entities.length > 0) {
    //   this.entitiesLoaded = true;
    // }
    this.autoUnsubscribe(
      this.entitiesService.allChange.subscribe((value) => {
        this.entities = value;
        this.onEntitiesLoaded();
        this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
        this.dataSource.sort = this.sort;
        this.entitiesLoaded = true;
        this.lumber.info('initializeEntities', 'Entities refreshed', this.entities);
      })
    );
  }

  public onDelete(modelId: number): void {
    this.lumber.info('onDelete', 'Opening delete question dialog');
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.entitiesService.delete(modelId).subscribe();
      }
    });
  }
}
