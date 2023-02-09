import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, Component, Inject, inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HasIDAndName, loggerOf, s_imploder} from 'dfts-helper';
import {NgbPaginator, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {combineLatest, filter, Observable, of, startWith, switchMap, tap} from 'rxjs';
import {HasDelete, HasGetAll, notNullAndUndefined} from '../services/abstract-entity.service';

import {QuestionDialogComponent} from './question-dialog/question-dialog.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListComponentV2<EntityType extends HasIDAndName<EntityType['id']>> implements AfterViewInit {
  protected lumber = loggerOf('AModelsListComponentV2');

  // Table stuff
  @ViewChild(NgbSort, {static: true}) sort?: NgbSort;
  @ViewChild(NgbPaginator, {static: true}) paginator?: NgbPaginator;
  protected abstract columnsToDisplay: string[];
  protected sortingDataAccessors?: Map<string, (it: EntityType) => any>;
  public filter = new FormControl('');
  public selection?: SelectionModel<EntityType>;

  protected modal = inject(NgbModal);

  dataSource$: Observable<NgbTableDataSource<EntityType>> = of(new NgbTableDataSource<EntityType>());

  protected entities?: NgbTableDataSource<EntityType>;

  protected constructor(@Inject(null) protected entitiesService: HasGetAll<EntityType> & HasDelete<EntityType>) {}

  ngAfterViewInit(): void {
    this.dataSource$ = this.getDataSource(this.entitiesService.getAll$());
  }

  protected getDataSource(entitiesStream: Observable<EntityType[]>): Observable<NgbTableDataSource<EntityType>> {
    return combineLatest([this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), entitiesStream]).pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource<EntityType>(all.slice());

        if (this.sortingDataAccessors) {
          dataSource.sortingDataAccessor = (item, property) => {
            const fun = this.sortingDataAccessors?.get(property);
            if (!fun) {
              return item[property as keyof EntityType];
            }
            return fun(item);
          };
        }
        if (this.sort) {
          dataSource.sort = this.sort;
        }
        if (this.paginator) {
          dataSource.paginator = this.paginator;
        }
        if (this.selection) {
          this.selection = new SelectionModel<EntityType>(true, []);
        }
        dataSource.filter = filterTerm ?? '';

        return of(dataSource);
      }),
      tap((dataSource) => (this.entities = dataSource))
    );
  }

  protected setSelectable(): void {
    this.columnsToDisplay = ['select'].concat(this.columnsToDisplay);
    this.selection = new SelectionModel<EntityType>(true, []);
  }

  public onDeleteAll(): void {
    if (!this.isAllSelected()) {
      this.toggleAllRows();
    }
    this.onDeleteSelected();
  }

  public onDelete(modelId: keyof EntityType['id'], event?: MouseEvent): void {
    event?.stopPropagation();
    this.lumber.info('onDelete', 'Opening delete question dialog');
    const modalRef = this.modal.open(QuestionDialogComponent, {ariaLabelledBy: 'modal-question-title', size: 'lg'});
    modalRef.componentInstance.title = 'DELETE_CONFIRMATION';
    void modalRef.result.then((result) => {
      this.lumber.info('onDelete', 'Question dialog result:', result?.toString());
      if (result?.toString().includes(QuestionDialogComponent.YES_VALUE)) {
        this.entitiesService.delete$(modelId).subscribe();
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
          this.entitiesService.delete$(selected.id).subscribe();
        }
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection?.selected.length;
    const numRows = this.entities?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection?.clear();
      return;
    }

    this.selection?.select(...(this.entities?.data ?? []));
  }
}
