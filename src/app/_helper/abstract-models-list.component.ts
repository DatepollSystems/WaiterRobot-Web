import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {AbstractComponent, AbstractEntity, IList, List, LoggerFactory} from 'dfx-helper';

import {AbstractModelService} from '../_services/abstract-model.service';

import {QuestionDialogComponent} from '../_shared/question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends AbstractEntity<number>> extends AbstractComponent implements OnInit {
  protected lumber = LoggerFactory.getLogger('AModelsListComponent');

  // Table stuff
  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;
  protected abstract columnsToDisplay: string[];
  public filter = new FormControl();
  public dataSource: NgbTableDataSource<EntityType> = new NgbTableDataSource();

  public entities: IList<EntityType> = new List();
  public entitiesLoaded = false;

  protected constructor(protected entitiesService: AbstractModelService<EntityType>, protected modal: NgbModal) {
    super();

    this.filter.valueChanges.subscribe((value) => {
      this.dataSource.filter = value;
      this.dataSource.sort = this.sort;
    });
  }

  protected initializeEntities(): void {
    this.entities = this.entitiesService.getAll();
    this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
    // Don't check because events waiters and org waiters use same list
    // if (this.entities.length > 0) {
    //   this.entitiesLoaded = true;
    // }
    this.autoUnsubscribe(
      this.entitiesService.allChange.subscribe((value) => {
        this.entities = value;
        this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());
        this.dataSource.sort = this.sort;
        this.entitiesLoaded = true;
      })
    );
  }

  ngOnInit(): void {
    this.initializeEntities();
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
}
