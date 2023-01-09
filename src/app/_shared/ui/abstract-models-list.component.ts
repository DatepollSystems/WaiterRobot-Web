import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IEntityWithName, IList, List, loggerOf, s_imploder, StringOrNumber} from 'dfts-helper';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {AComponent, AEntityService} from 'dfx-helper';

import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponent<EntityType extends IEntityWithName<StringOrNumber>>
  extends AComponent
  implements AfterViewInit
{
  protected lumber = loggerOf('AModelsListComponent');

  // Table stuff
  @ViewChild(NgbSort, {static: true}) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator?: NgbPaginator;
  protected abstract columnsToDisplay: string[];
  protected sortingDataAccessors?: Map<string, (it: EntityType) => any>;
  public filter = new UntypedFormControl();
  public dataSource: NgbTableDataSource<EntityType> = new NgbTableDataSource();

  public entities: IList<EntityType> = new List();
  public entitiesLoaded = false;

  public selection?: SelectionModel<EntityType>;

  protected constructor(protected modal: NgbModal, protected entitiesService: AEntityService<StringOrNumber, EntityType>) {
    super();

    this.unsubscribe(
      this.filter.valueChanges.subscribe((value) => {
        this.dataSource.filter = value;
      })
    );
  }

  ngAfterViewInit(): void {
    this.initializeEntities();
  }

  protected setSelectable(): void {
    this.columnsToDisplay.unshift('select');
    this.selection = new SelectionModel<EntityType>(true, []);
  }

  protected onEntitiesLoaded(): void {}

  protected initializeEntities(): void {
    this.entities = this.entitiesService.getAll();
    if (this.entities.length > 0) {
      this.onEntitiesLoaded();
    }
    this.lumber.info('initializeEntities', 'Entities loaded', this.entities);
    this.setDatasource();
    // Don't check because events waiters and org waiters use same list
    // if (this.entities.length > 0) {
    //   this.entitiesLoaded = true;
    // }
    this.unsubscribe(
      this.entitiesService.allChange.subscribe((value) => {
        this.entities = value;
        this.onEntitiesLoaded();
        this.setDatasource();
        this.entitiesLoaded = true;
        this.lumber.info('initializeEntities', 'Entities refreshed', this.entities);
      })
    );
  }

  private setDatasource(): void {
    this.dataSource = new NgbTableDataSource<EntityType>(this.entities.clone());

    if (this.sortingDataAccessors) {
      this.dataSource.sortingDataAccessor = (item, property) => {
        const fun = this.sortingDataAccessors?.get(property);
        if (!fun) {
          return item[property as keyof EntityType];
        }
        return fun(item);
      };
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.selection) {
      this.selection = new SelectionModel<EntityType>(true, []);
    }
  }

  public onDeleteAll(): void {
    if (!this.isAllSelected()) {
      this.toggleAllRows();
    }
    this.onDeleteSelected();
  }

  public onDelete(modelId: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.lumber.info('onDelete', 'Opening delete question dialog');
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result?.toString());
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.entitiesService.delete(modelId).subscribe();
      }
    });
  }

  public onDeleteSelected(): void {
    if (!this.selection) {
      this.lumber.error('onDeleteSelected', 'Enable selectable with this.setSelectable()');
      return;
    }

    this.lumber.info('onDeleteSelected', 'Opening delete question dialog');
    this.lumber.info('onDeleteSelected', 'Selected entities:', this.selection.selected);
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_ALL';
    const list = s_imploder()
      .mappedSource(this.selection.selected, (it) => it.name)
      .separator('</li><li>')
      .build();
    modalRef.componentInstance.info = `<ol><li>${list}</li></ol>`;
    void modalRef.result.then((result) => {
      this.lumber.info('onDeleteSelected', 'Question dialog result:', result);
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        for (const selected of this.selection?.selected ?? []) {
          this.entitiesService.delete(selected.id).subscribe();
        }
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection?.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection?.clear();
      return;
    }

    this.selection?.select(...this.dataSource.data);
  }
}
